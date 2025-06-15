// next.config.mjs
import withPWA from 'next-pwa';

const nextConfig = {
distDir: 'build',
  reactStrictMode: true,
  compiler:{
    removeConsole: process.env.NODE_ENV !== 'development',
  }
}


export default withPWA({
    dest: 'public',
    disable: false,
    register: true,
    skipWaiting: true,
})(nextConfig);
