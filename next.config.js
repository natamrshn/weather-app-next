/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openweathermap.org', 'images.unsplash.com', 'source.unsplash.com'],
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      }
    }
    return config
  },
}

module.exports = nextConfig

