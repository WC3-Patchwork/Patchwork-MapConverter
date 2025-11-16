import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": [
            "error",
            {
                "allow": [
                    "private-constructors"
                ]
            }
        ],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/strict-boolean-expressions": "off"
    },
    ignores: ["eslint.config.mjs", "/bin", "/build", "/node_modules", "/generateProgramMetadata.js",]
  }
);