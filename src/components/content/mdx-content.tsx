'use client'

import * as runtime from 'react/jsx-runtime'
import { Callout } from './callout'
import { StepByStep, Step } from './step-by-step'

function useMDXComponent(code: string) {
  // Standard MDX hydration pattern — code comes from Velite build-time compilation of trusted content
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  Callout,
  StepByStep,
  Step,
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return (
    <div className="prose prose-invert prose-green max-w-none">
      <Component components={components} />
    </div>
  )
}
