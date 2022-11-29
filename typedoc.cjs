module.exports = {
    entryPoints: ['src'],
    entryPointStrategy: 'Expand',
    out: 'docs',
    plugin: ['typedoc-theme-hierarchy'],
    theme: 'hierarchy',
    tsconfig: './tsconfig.json',
    name: '@nodecfdi/sat-ws-descarga-masiva',
    exclude: ['./src/globals.d.ts', './src/__tests__']
};
