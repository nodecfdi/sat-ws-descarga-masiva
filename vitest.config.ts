import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        alias: {
            '~': './src'
        },
        coverage: {
            all: true,
            provider: 'istanbul',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts']
        }
    }
});
