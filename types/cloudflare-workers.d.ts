// GitHub Pages用の型確認で、Sites専用機能を安全に読み飛ばすための最小定義
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}

interface D1Database {}
