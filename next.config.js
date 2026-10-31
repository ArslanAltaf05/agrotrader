/** @type {import('next').NextConfig} */
const isExport = process.env.CAPACITOR_BUILD === '1' || process.env.STATIC_EXPORT === '1';

const nextConfig = {
  ...(isExport ? { output: 'export' } : {}),
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
