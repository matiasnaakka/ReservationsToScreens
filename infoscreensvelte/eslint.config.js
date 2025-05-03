import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';
import {fileURLToPath} from 'node:url';
import tseslint from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      svelte: sveltePlugin
    },
    rules: {
      'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      'no-console': ['warn', {allow: ['warn', 'error']}],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn'
    }
  }
);
