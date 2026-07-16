import withMDX from '@next/mdx' 

const nextConfig = {
  /* config options here */
   pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withMDX()(nextConfig)