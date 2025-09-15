// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages 설정
  output: 'export',
  // trailingSlash: true, // 루트 도메인에서는 이 옵션을 제거하는 것을 권장합니다.
  basePath: '', // 모든 환경에서 basePath를 빈 문자열로 고정합니다.
}

export default nextConfig;