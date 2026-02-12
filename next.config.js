/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорируем ошибки типов
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки стиля
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;