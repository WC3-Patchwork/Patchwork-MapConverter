import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    ignores: [
        "/bin",
        "/build",
        "/node_modules",
        "/generateProgramMetadata.js",
        "/tsconfig.json"
    ],
    languageOptions: {
      parser: tseslint.parser,
        parserOptions: {
            projectService: true
        }
    },
    rules: {
      "no-trailing-spaces": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "require-await": "off",
      "no-empty-function": "off",
    }
  }
);