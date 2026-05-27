/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.coolstay.co.kr" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "http", hostname: "cdn.coolstay.co.kr" },
    ],
  },
};

export default nextConfig;
