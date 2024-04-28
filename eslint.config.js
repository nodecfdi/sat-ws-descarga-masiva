import { nodecfdiConfig } from '@nodecfdi/eslint-config';
import { defineFlatConfig } from 'eslint-define-config';

export default defineFlatConfig([
  ...nodecfdiConfig({ vitest: true }),
  {
    files: ['**/types.ts', '**/types/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-shadow': 'off',
    },
  },
  {
    files: ['tests/**/*.spec.ts'],
    rules: {
      'import-x/no-unassigned-import': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
]);
