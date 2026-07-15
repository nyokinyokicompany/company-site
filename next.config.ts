import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // GitHub Pagesでは静的ファイルとして書き出す
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/company-site" : "",
  assetPrefix: isGitHubPages ? "/company-site/" : undefined,
};

export default nextConfig;
