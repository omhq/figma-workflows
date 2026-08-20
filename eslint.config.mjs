import eslint from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['*.cjs'],
    languageOptions: { globals: globals.node },
    rules: { '@typescript-eslint/no-require-imports': 'off' }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        __html__: 'readonly',
        figma: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-case-declarations': 'off',
      'no-empty': 'off',
      'no-useless-escape': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    files: [
      'src/app/components/action-args-form/**/*.{ts,tsx}',
      'src/app/components/home/**/*.tsx',
      'src/app/components/shortcut/**/*.tsx',
      'src/app/hooks/node-selection.ts',
      'src/app/hooks/plugin-data.ts'
    ],
    rules: {
      'react-hooks/exhaustive-deps': 'off'
    }
  }
)
