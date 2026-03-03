import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/pagefind/**",
  ]),
  // R3F: useFrame callbacks mutate Three.js uniforms (not React state)
  {
    files: ["src/components/three/**"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
  // Velite MDX: dynamic component creation is the standard hydration pattern
  {
    files: ["src/components/content/mdx-content.tsx"],
    rules: {
      "react-hooks/static-components": "off",
    },
  },
  // shadcn/ui skeleton: intentional Math.random for varied widths
  {
    files: ["src/components/ui/sidebar.tsx"],
    rules: {
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
