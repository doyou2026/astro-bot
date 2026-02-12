/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорируем ошибки типов во время билда
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
