/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    customKey: "my-value",
  },
  images: {
    domains: ["storage.googleapis.com"],
  },
};

module.exports = nextConfig;
