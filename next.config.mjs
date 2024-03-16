/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "img.clerk.com",
      "images.clerk.dev",
      "devansh-threads-bucket.s3.ap-south-1.amazonaws.com"
    ]
  }
};

export default nextConfig;
