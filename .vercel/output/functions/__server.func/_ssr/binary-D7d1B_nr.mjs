//#region node_modules/.nitro/vite/services/ssr/assets/binary-D7d1B_nr.js
var BINARY_LIMITS = {
	maxBytes: 2e7,
	maxStrings: 4e3,
	minStringLen: 5
};
var ELF_MACHINES = {
	3: "x86",
	40: "ARM",
	62: "x86-64",
	183: "AArch64",
	8: "MIPS",
	243: "RISC-V",
	20: "PowerPC"
};
var PE_MACHINES = {
	332: "x86",
	34404: "x86-64",
	448: "ARM",
	43620: "AArch64"
};
function asciiAt(b, off, len) {
	let s = "";
	for (let i = 0; i < len && off + i < b.length; i++) {
		const c = b[off + i];
		s += c >= 32 && c < 127 ? String.fromCharCode(c) : "\0";
	}
	return s;
}
/** Extract printable ASCII strings (length >= minLen), capped. */
function extractStrings(bytes, minLen = BINARY_LIMITS.minStringLen, cap = BINARY_LIMITS.maxStrings) {
	const out = [];
	let cur = [];
	const flush = () => {
		if (cur.length >= minLen) out.push(String.fromCharCode(...cur));
		cur = [];
	};
	for (let i = 0; i < bytes.length && out.length < cap; i++) {
		const c = bytes[i];
		if (c >= 32 && c < 127) cur.push(c);
		else flush();
	}
	flush();
	return out;
}
function parseElf(b) {
	const bits = b[4] === 2 ? 64 : b[4] === 1 ? 32 : null;
	const little = b[5] !== 2;
	const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
	const u16 = (o) => little ? dv.getUint16(o, true) : dv.getUint16(o, false);
	const u32 = (o) => little ? dv.getUint32(o, true) : dv.getUint32(o, false);
	const u64 = (o) => little ? Number(dv.getBigUint64(o, true)) : Number(dv.getBigUint64(o, false));
	const arch = ELF_MACHINES[u16(18)] ?? `machine-${u16(18)}`;
	const sections = [];
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
					const c = b[strOff + nameOff + j];
					if (c === 0) break;
					name += String.fromCharCode(c);
				}
				const offset = bits === 64 ? u64(h + 24) : u32(h + 16);
				const size = bits === 64 ? u64(h + 32) : u32(h + 20);
				if (name) sections.push({
					name,
					size,
					offset
				});
			}
		}
	} catch {}
	return {
		format: "ELF",
		arch,
		bits,
		sections
	};
}
function parsePe(b) {
	const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
	const peOff = dv.getUint32(60, true);
	if (peOff + 24 > b.length || asciiAt(b, peOff, 2) !== "PE") return { format: "PE" };
	const arch = PE_MACHINES[dv.getUint16(peOff + 4, true)] ?? `machine-${dv.getUint16(peOff + 4, true)}`;
	const numSections = dv.getUint16(peOff + 6, true);
	const optSize = dv.getUint16(peOff + 20, true);
	const optOff = peOff + 24;
	const magic = dv.getUint16(optOff, true);
	const bits = magic === 523 ? 64 : magic === 267 ? 32 : null;
	const sections = [];
	const secOff = optOff + optSize;
	for (let i = 0; i < Math.min(numSections, 96) && secOff + i * 40 + 40 <= b.length; i++) {
		const h = secOff + i * 40;
		const name = asciiAt(b, h, 8).replace(/\0+$/g, "");
		sections.push({
			name,
			size: dv.getUint32(h + 16, true),
			offset: dv.getUint32(h + 20, true)
		});
	}
	return {
		format: "PE",
		arch,
		bits,
		sections
	};
}
/** Well-known strings that reveal imported libraries / capabilities. */
var IMPORT_HINTS = [
	/\.so\b[\w.-]*/i,
	/\b\w+\.dll\b/i,
	/\b(libcurl|openssl|libssl|zlib|sqlite3|pthread|libc)\b/i,
	/\b(CreateFile|ReadFile|WriteFile|RegOpenKey|Socket|connect|send|recv|fork|execve|dlopen|GetProcAddress|LoadLibrary)[AW]?\b/
];
function analyzeBinary(bytes) {
	const size = bytes.length;
	let base = {
		format: "unknown",
		arch: "unknown",
		bits: null,
		sections: []
	};
	if (size >= 4) {
		if (bytes[0] === 127 && bytes[1] === 69 && bytes[2] === 76 && bytes[3] === 70) base = parseElf(bytes);
		else if (bytes[0] === 77 && bytes[1] === 90) base = parsePe(bytes);
		else if (bytes[0] === 254 && bytes[1] === 237 && bytes[2] === 250 || bytes[0] === 207 && bytes[1] === 250 && bytes[2] === 237) base = {
			format: "Mach-O",
			arch: "unknown",
			bits: null,
			sections: []
		};
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
		strings
	};
}
/** Search extracted strings for a keyword or regex (case-insensitive), capped. */
function searchStrings(info, query, cap = 12) {
	const q = query.trim();
	if (!q) return info.strings.slice(0, cap);
	let re = null;
	try {
		re = new RegExp(q, "i");
	} catch {
		re = null;
	}
	const lower = q.toLowerCase();
	return info.strings.filter((s) => re ? re.test(s) : s.toLowerCase().includes(lower)).slice(0, cap);
}
//#endregion
export { analyzeBinary as n, searchStrings as r, BINARY_LIMITS as t };
