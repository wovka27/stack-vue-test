import prettier from '@vue/eslint-config-prettier';
import ts from '@vue/eslint-config-typescript';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...ts(),
  prettier,
  {
    files: ['**/*.{ts,vue,js}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
