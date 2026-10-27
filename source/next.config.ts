import type { NextConfig } from "next";

// Static export for GitHub Pages at https://ngfranki.github.io/eva-mum/
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/eva-mum",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
