// next.config.ts
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // 開発時のみ: next dev はサーバーとして動くのでrewritesが使える。
    // ローカルのバックエンド(Go/Spring Boot、localhost:8277)へプロキシする。
    return {
      async rewrites() {
        return [
          {
            source: "/api/:path*",
            destination: "http://localhost:8277/:path*",
          },
        ];
      },
    };
  }

  // 本番ビルド: 静的エクスポート。rewritesは使えない/不要
  // (Goバイナリが静的ファイルと/apiを同一オリジンで配信するため、
  //  axios.tsのbaseURL: "/api" がそのまま正しく解決される)
  return {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true, // <-- add this
    },
  };
};

export default nextConfig;
