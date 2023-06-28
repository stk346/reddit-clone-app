/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com", "localhost"] // 리소스를 허용할 domain 주소들
  }
}

module.exports = nextConfig
