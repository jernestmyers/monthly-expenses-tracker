import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  pluginReactJsxRuntime,
  { settings: { react: { version: 'detect' } } },
  eslintConfigPrettier,
];
