'use client'

import dynamic from 'next/dynamic'

const AuroraScene = dynamic(() => import('./aurora-scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: '#050508' }} />
  ),
})

export default function SceneWrapper() {
  return <AuroraScene />
}
