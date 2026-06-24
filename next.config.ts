/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your dev origins for local testing
  allowedDevOrigins: ['192.168.0.162', '192.168.114.104', '10.21.83.104:3000'],
 
  // CRITICAL for Google Cloud Run / Docker
  output: 'standalone',
  
  // Optional: If you are using external images (like from Firebase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

module.exports = nextConfig;
