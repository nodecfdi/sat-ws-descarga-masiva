import isCI from 'is-ci';
import { defineConfig, type Options } from 'tsup';

const entry = 'src/index.ts';

const sharedConfig = defineConfig({
    name: 'sat-ws-descarga-masiva',
    splitting: false,
    sourcemap: true,
    format: ['esm', 'cjs'],
    minify: isCI,
    shims: true,
});

const mainConfig = defineConfig({
    ...sharedConfig,
    entry: {
        'sat-ws-descarga-masiva': entry,
    },
    dts: false,
}) as Options;

const dtsConfig = defineConfig({
    ...sharedConfig,
    entry: {
        'sat-ws-descarga-masiva': entry,
    },
    dts: {
        entry,
        only: true,
        resolve: true,
    },
}) as Options;

export default defineConfig([mainConfig, dtsConfig]);
