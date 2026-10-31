# RECON — Autonomous Software Investigator

RECON is an autonomous software reconnaissance and system investigation platform. It performs evidence-backed investigations into repositories, live web services, binaries, running endpoints, and visual captures.

## Features

- **Multi-Target Analysis**:
  - **Repository Analysis (White-Box)**: Multi-language AST & symbol scanner (Python, JS/TS, Go, Rust, Java, C#, etc.).
  - **Website Crawling (Black-Box)**: Page, form, script, and API endpoint discovery with SSRF protection.
  - **Runtime Probing (Gray-Box)**: Safe, read-only HTTP method and endpoint fingerprinting.
  - **Binary Extraction**: In-memory static inspection of ELF, PE, and Mach-O files (sections, imports, strings) without executing code.
  - **Visual Capture**: In-browser media review, frame extraction with WASM FFmpeg, and tab recording.
- **Deterministic Verification**: Claims are independently verified against collected evidence; scores are computed algorithmically rather than asserted by an LLM.
- **Interactive Graphs**: Visual flow graphs powered by React Flow (`@xyflow/react`).

## Getting Started

### Prerequisites
- Node.js (v20+) or Bun
- Supabase project credentials

### Environment Setup
Create a `.env` file in the root directory:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
RECON_TOKEN_ENCRYPTION_SECRET="generate-any-32-char-random-secret"
OPENAI_API_KEY="your-openai-api-key"
```

### Installation & Development

```sh
npm install
npm run dev
```

### Testing

```sh
npm test
```

## Built With

- **Framework**: TanStack Start & TanStack Router
- **UI**: React 19, Tailwind CSS v4, Radix UI
- **Visualization**: React Flow (`@xyflow/react`), Recharts
- **Database & Auth**: Supabase (PostgreSQL)
