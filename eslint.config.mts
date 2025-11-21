import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'

const listStyleDefault = { "singleLine": { "maxItems": Number.POSITIVE_INFINITY }}

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.stylisticTypeChecked,
  tseslint.configs.recommendedTypeChecked,
  stylistic.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic
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
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "require-await": "off",
      "@stylistic/key-spacing": [ "warn",
        {
          "mode": "strict",
          "afterColon": true,
          "align": "colon",
          "ignoredNodes": ["TSInterfaceBody", "ClassBody", "TSTypeLiteral"]
        }
      ],
      "@stylistic/type-annotation-spacing": ["warn",
        {"after": true}
      ],
      "@stylistic/eol-last": ["warn", "never"],
      "@stylistic/brace-style": ["warn", "1tbs"],
      "@stylistic/comma-dangle": ["warn", "never"]
    }
  }
);