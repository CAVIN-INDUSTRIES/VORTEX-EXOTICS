/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
<<<<<<< Updated upstream
  transpilePackages: ["@vex/shared", "@vex/ui"],
  env: {
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
    NEXT_PUBLIC_HERO_VIDEO_URL: process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "",
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "three", "@react-three/fiber", "@react-three/drei"];
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
=======
  transpilePackages: ["@vex/shared"],
  // Static export for Netlify
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Allow trailing slashes for cleaner URLs
  trailingSlash: true,
>>>>>>> Stashed changes
};

export default nextConfig;
