import type { NextConfig } from 'next'

// Velite integration (Turbopack-compatible)
// Triggers Velite build at config load time, before Next.js starts compiling.
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  import('velite').then((m) => m.build({ watch: isDev, clean: !isDev }))
}

const nextConfig: NextConfig = {
  // Needed later for React Three Fiber
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

export default nextConfig
