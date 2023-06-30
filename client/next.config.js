/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-13-124-204-222.ap-northeast-2.compute.amazonaws.com"
    ] // 리소스를 허용할 domain 주소들
  }
}

module.exports = nextConfig
