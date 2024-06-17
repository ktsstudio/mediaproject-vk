// @ts-check
import eslint from '@eslint/js';
import importPluginX from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.strict,
  ...tsEslint.configs.stylistic,
  {
    ignores: ['dist/**'],
    plugins: {
      react: reactPlugin,
      'import-x': importPluginX,
    },
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'prefer-destructuring': ['error', { object: true, array: false }],
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off', // отключает принудительное использование только `type` или `interface`
      '@typescript-eslint/no-invalid-void-type': 'off', // отключает использование `void` только в сигнатуре возврата функции
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'padding-line-between-statements': [
        'error',

        // After directives (like 'use-strict'), except between directives
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },

        // Before and after export
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },

        // Before and after every sequence of variable declarations
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },

        // Before and after class declaration, if, while, switch, try
        {
          blankLine: 'always',
          prev: '*',
          next: ['class', 'if', 'while', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['class', 'if', 'while', 'switch', 'try'],
          next: '*',
        },

        // Before return statements
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-target-blank': 'off',
      'react/prefer-stateless-function': 'error',
      'react/display-name': 'off',
    },
  },
  eslintPluginPrettierRecommended
);
