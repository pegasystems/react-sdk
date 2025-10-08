import { globalIgnores } from 'eslint/config';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
// eslint.config.js
import { defineConfig } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  globalIgnores([
    '**/node_modules',
    '!**/.storybook',
    '.storybook/public',
    '**/demo.stories.*',
    '**/*.test.tsx',
    '**/mock.stories.ts',
    '**/*.mdx',
    '**/webpack.config.js',
    'src/helpers/config_access.js',
    '**/*.html',
    '**/*.css',
    '**/*.json',
    '**/*.md',
    '**/*.svg',
    '**/*.zip',
    '**/*.d.ts',
    '*.storybook/*',
    '**/*.cjs',
    '**/*.mjs',
    'dist/*',
    'lib/*',
    'scripts/*.*'
  ]),
  {
    languageOptions: {
      globals: {
        PCore: 'readonly',
        window: true,
        console: true,
        document: true,
        fetch: true
      },

      ecmaVersion: 13,
      sourceType: 'script',

      parserOptions: {
        project: 'tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      'import/resolver': {
        typescript: {},
        react: {
          version: 'detect'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },

      react: {
        version: 'detect'
      }
    },

    plugins: { sonarjs, import: importPlugin, react, 'react-hooks': reactHooks },
    rules: {
      'react/jsx-filename-extension': [0, { extensions: ['.jsx', '*.tsx'] }],

      // Prettier recommends running separately from a linter.
      // https://prettier.io/docs/en/integrating-with-linters.html#notes
      'prettier/prettier': 'off',

      // Disable rules from shared configs we're not ready for yet.
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': 'off',

      //
      // Initial release: turning these off; phase in to "warn" or "error" over time
      //  For "quotes" and "@typescript-eslint/quotes", see override below for .ts/.tsx files
      'import/extensions': ['off', 'never'],
      'import/named': 'off',
      'import/no-cycle': 'off',
      'import/no-duplicates': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-self-import': 'off',
      'import/no-unresolved': 'off',
      'import/no-useless-path-segments': 'off',
      'import/order': 'off',

      'no-underscore-dangle': 'off', // TODO : adhere to standard naming
      'no-restricted-syntax': 'warn', // TODO : fix for-in loops

      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',

      '@typescript-eslint/naming-convention': 'off', // prefer warn but needs different parserOptions
      '@typescript-eslint/ban-types': 'off', // also, see override below
      '@typescript-eslint/no-explicit-any': 'off', // prefer warn but needs different parserOptions
      '@typescript-eslint/no-empty-object-type': 'off', // prefer warn but needs different parserOptions
      '@typescript-eslint/ban-ts-comment': 'off', // prefer warn but needs different parserOptions
      '@typescript-eslint/no-unsafe-function-type': 'off',

      'import/no-relative-packages': 'off' // arnab
    }
  },
  {
    files: ['**/*.@(ts|tsx)'],

    rules: {
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      quotes: 'off',
      '@typescript-eslint/quotes': 'off'
    }
  },
  {
    files: ['**/*.@(jsx|tsx|mdx)'],

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  },
  {
    files: ['**/*.@(ts|tsx)'],
    rules: {
      'no-console': 'off',
      'import/prefer-default-export': 'off',
      'import/no-relative-packages': 'off',
      'react/jsx-fragments': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'sonarjs/cognitive-complexity': ['warn', 45]
    }
  },
  {
    files: ['**/*.@(js|jsx|ts|tsx|mdx)'],
    rules: {}
  },

  {
    files: ['*/**/mocks/**.@(mocks|styles).@(tsx|ts)'],

    rules: {
      'import/prefer-default-export': ['off']
    }
  }
]);
