import SceneWrapper from '@/components/three/scene-wrapper'
import { Hero } from '@/components/landing/hero'
import { Corners } from '@/components/landing/corners'
import { Grain } from '@/components/landing/grain'

export default function LandingPage() {
  return (
    <>
      <SceneWrapper />
      <Grain />
      <Corners />
      <Hero />
    </>
  )
}
