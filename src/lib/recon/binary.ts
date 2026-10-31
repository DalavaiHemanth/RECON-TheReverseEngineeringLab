// Static binary analysis: file-type identification, printable strings, ELF/PE
// headers, sections and imported symbols. Pure TypeScript — runs on edge workers
// and in the browser. The binary is never executed.

export type BinarySection = { name: string; size: number; offset: number };
export type BinaryInfo = {
  format: "ELF" | "PE" | "Mach-O" | "unknown";
  arch: string;
  bits: 32 | 64 | null;
  sizeBytes: number;
  sections: BinarySection[];
  imports: string[];
  strings: string[];
};

export const BINARY_LIMITS = { maxBytes: 20_000_000, maxStrings: 4000, minStringLen: 5 };

const ELF_MACHINES: Record<number, string> = {
  0x03: "x86", 0x28: "ARM", 0x3e: "x86-64", 0xb7: "AArch64", 0x08: "MIPS", 0xf3: "RISC-V", 0x14: "PowerPC",
};
const PE_MACHINES: Record<number, string> = {
  0x14c: "x86", 0x8664: "x86-64", 0x1c0: "ARM", 0xaa64: "AArch64",
};

function asciiAt(b: Uint8Array, off: number, len: number): string {
  let s = "";
  for (let i = 0; i < len && off + i < b.length; i++) {
    const c = b[off + i]!;
    s += c >= 32 && c < 127 ? String.fromCharCode(c) : "\0";
  }
  return s;
}

/** Extract printable ASCII strings (length >= minLen), capped. */
export function extractStrings(bytes: Uint8Array, minLen = BINARY_LIMITS.minStringLen, cap = BINARY_LIMITS.maxStrings): string[] {
  const out: string[] = [];
  let cur: number[] = [];
  const flush = () => {
    if (cur.length >= minLen) out.push(String.fromCharCode(...cur));
    cur = [];
  };
  for (let i = 0; i < bytes.length && out.length < cap; i++) {
    const c = bytes[i]!;
    if (c >= 32 && c < 127) cur.push(c);
    else flush();
  }
  flush();
  return out;
}

function parseElf(b: Uint8Array): Partial<BinaryInfo> {
  const bits = b[4] === 2 ? 64 : b[4] === 1 ? 32 : null;
  const little = b[5] !== 2;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const u16 = (o: number) => (little ? dv.getUint16(o, true) : dv.getUint16(o, false));
  const u32 = (o: number) => (little ? dv.getUint32(o, true) : dv.getUint32(o, false));
  const u64 = (o: number) => (little ? Number(dv.getBigUint64(o, true)) : Number(dv.getBigUint64(o, false)));
  const arch = ELF_MACHINES[u16(18)] ?? `machine-${u16(18)}`;
  const sections: BinarySection[] = [];
  try {
    const shOff = bits === 64 ? u64(40) : u32(32);
    const shEntSize = bits === 64 ? u16(58) : u16(46);
    const shNum = bits === 64 ? u16(60) : u16(48);
    const shStrNdx = bits === 64 ? u16(62) : u16(50);
    if (shOff > 0 && shNum > 0 && shNum < 512 && shOff + shNum * shEntSize <= b.length) {
      const strHdr = shOff + shStrNdx * shEntSize;
      const strOff = bits === 64 ? u64(strHdr + 24) : u32(strHdr + 16);
      for (let i = 0; i < shNum; i++) {
        const h = shOff + i * shEntSize;
        const nameOff = u32(h);
        let name = "";
        for (let j = 0; j < 64 && strOff + nameOff + j < b.length; j++) {
          const c = b[strOff + nameOff + j]!;
          if (c === 0) break;
          name += String.fromCharCode(c);
        }
        const offset = bits === 64 ? u64(h + 24) : u32(h + 16);
        const size = bits === 64 ? u64(h + 32) : u32(h + 20);
        if (name) sections.push({ name, size, offset });
      }
    }
  } catch {
    /* malformed header — return what we have */
  }
  return { format: "ELF", arch, bits, sections };
}

function parsePe(b: Uint8Array): Partial<BinaryInfo> {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const peOff = dv.getUint32(0x3c, true);
  if (peOff + 24 > b.length || asciiAt(b, peOff, 2) !== "PE") return { format: "PE" };
  const arch = PE_MACHINES[dv.getUint16(peOff + 4, true)] ?? `machine-${dv.getUint16(peOff + 4, true)}`;
  const numSections = dv.getUint16(peOff + 6, true);
  const optSize = dv.getUint16(peOff + 20, true);
  const optOff = peOff + 24;
  const magic = dv.getUint16(optOff, true);
  const bits = magic === 0x20b ? 64 : magic === 0x10b ? 32 : null;
  const sections: BinarySection[] = [];
  const secOff = optOff + optSize;
  for (let i = 0; i < Math.min(numSections, 96) && secOff + i * 40 + 40 <= b.length; i++) {
    const h = secOff + i * 40;
    const name = asciiAt(b, h, 8).replace(/\0+$/g, "");
    sections.push({ name, size: dv.getUint32(h + 16, true), offset: dv.getUint32(h + 20, true) });
  }
  return { format: "PE", arch, bits, sections };
}

/** Well-known strings that reveal imported libraries / capabilities. */
const IMPORT_HINTS = [
  /\.so\b[\w.-]*/i, /\b\w+\.dll\b/i, /\b(libcurl|openssl|libssl|zlib|sqlite3|pthread|libc)\b/i,
  /\b(CreateFile|ReadFile|WriteFile|RegOpenKey|Socket|connect|send|recv|fork|execve|dlopen|GetProcAddress|LoadLibrary)[AW]?\b/,
];

export function analyzeBinary(bytes: Uint8Array): BinaryInfo {
  const size = bytes.length;
  let base: Partial<BinaryInfo> = { format: "unknown", arch: "unknown", bits: null, sections: [] };
  if (size >= 4) {
    if (bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) base = parseElf(bytes);
    else if (bytes[0] === 0x4d && bytes[1] === 0x5a) base = parsePe(bytes);
    else if ((bytes[0] === 0xfe && bytes[1] === 0xed && bytes[2] === 0xfa) || (bytes[0] === 0xcf && bytes[1] === 0xfa && bytes[2] === 0xed))
      base = { format: "Mach-O", arch: "unknown", bits: null, sections: [] };
  }
  const strings = extractStrings(bytes);
  const imports = [...new Set(strings.filter((s) => IMPORT_HINTS.some((re) => re.test(s))))].slice(0, 200);
  return {
    format: base.format ?? "unknown",
    arch: base.arch ?? "unknown",
    bits: base.bits ?? null,
    sizeBytes: size,
    sections: base.sections ?? [],
    imports,
    strings,
  };
}

/** Search extracted strings for a keyword or regex (case-insensitive), capped. */
export function searchStrings(info: BinaryInfo, query: string, cap = 12): string[] {
  const q = query.trim();
  if (!q) return info.strings.slice(0, cap);
  let re: RegExp | null = null;
  try {
    re = new RegExp(q, "i");
  } catch {
    re = null;
  }
  const lower = q.toLowerCase();
  return info.strings.filter((s) => (re ? re.test(s) : s.toLowerCase().includes(lower))).slice(0, cap);
}
