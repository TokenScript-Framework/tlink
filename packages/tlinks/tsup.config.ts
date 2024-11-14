import { defineConfig, type Options } from 'tsup';

const commonCfg: Partial<Options> = {
  splitting: true,
  sourcemap: false,
  clean: true,
  format: ['cjs', 'esm'],
  target: ['esnext'],
};

export default defineConfig([
  {
    ...commonCfg,
    entry: [
      'src/index.ts',
      'src/index.css',
      'src/ext/twitter.tsx',
      'src/createTlink.ts',
      'src/utils/index.ts',
    ],
    dts: {
      entry: [
        'src/index.ts',
        'src/ext/twitter.tsx',
        'src/createTlink.ts',
        'src/utils/index.ts',
      ],
    },
  },
]);
