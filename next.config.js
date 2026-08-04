/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  // The domain root serves the static rebuild teaser; the portfolio now lives
  // at /work. beforeFiles so this wins over app-router filesystem routes.
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/soon/index.html' }],
    }
  },
}
module.exports = nextConfig
