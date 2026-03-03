'use client'

import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'
import { Callout } from './callout'
import { StepByStep, Step } from './step-by-step'

// Velite build-time MDX hydration — code is trusted, compiled at build time
function getMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

const components = {
  Callout,
  StepByStep,
  Step,
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code])
  return (
    <div className="prose prose-invert prose-green max-w-none">
      <Component components={components} />
    </div>
  )
}
