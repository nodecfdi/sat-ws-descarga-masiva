module.exports = {
    theme: 'markdown',
    readme: 'none',
    excludePrivate: true,
    excludeInternal: true,
    excludeProtected: true,
    exclude: ['./src/globals.d.ts', './src/__tests__'],
    out: 'docs',
    entryPoints: ['./src/index.ts']
};
