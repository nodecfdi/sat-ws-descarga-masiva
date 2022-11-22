module.exports = {
    root: true,
    env: {
        // commonjs: true,
        es6: true,
        node: true,
        browser: false,
        jest: true
    },
    globals: {
        __DEV__: true,
        __VERSION__: true,
        __COMMIT_SHA__: true,
        __BUILD_DATE__: true
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc', 'prettier'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    reportUnusedDisableDirectives: true,
    parserOptions: {
        /* enabling "project" field is a performance hit
            https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#performance
        */
        sourceType: 'module'
    },
    rules: {
        'indent': 'off',
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'semi': 'error',
        'quote-props': ['error', 'consistent'],
        'generator-star-spacing': ['error', { before: true, after: false }],
        'space-before-function-paren': 'off',
        'no-dupe-class-members': 'off',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        'prettier/prettier': ['error'],
        'lines-between-class-members': ['error', 'always'],
        'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    constructors: 'no-public'
                }
            }
        ],
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-expect-error': 'allow-with-description'
            }
        ],
        '@typescript-eslint/no-non-null-assertion': [2],
        '@typescript-eslint/no-explicit-any': [2, { ignoreRestArgs: true }],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                },
                multilineDetection: 'brackets'
            }
        ],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/no-empty-interface': 'off'
    },
    overrides: [
        {
            files: ['*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-var-requires': 'off'
            }
        }
    ]
};
