/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "img.clerk.com",
      "images.clerk.dev",
      "devansh-threads-bucket.s3.ap-south-1.amazonaws.com",
      "i.pinimg.com",
      "images.unsplash.com",
      "newprofilepic2.photo-cdn.net",
      "encrypted-tbn0.gstatic.com"
    ]
  },
  reactStrictMode: false
};

export default nextConfig;
