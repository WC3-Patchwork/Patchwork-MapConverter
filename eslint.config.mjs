//@ts-check

import es from '@eslint/js';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';

export default defineConfig({
	plugins: {
		'@typescript-eslint': ts.plugin,
	},
	languageOptions: {
		parser: ts.parser,
		parserOptions: {
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
		},
		ecmaVersion: 2022,
		globals: {
			document: 'off',
			navigator: 'off',
			window: 'off',
		},
	},
	files: ['./src/**/*.ts'],
	ignores: ['./src/**/*.d.ts'],
	rules: {
		'@typescript-eslint/restrict-template-expressions': 'error',
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': ['error', { allow: ['private-constructors'] }],
		'@typescript-eslint/no-unused-vars': 'off',
		'no-useless-escape': 'off',
		'no-self-assign': 'error',
	},
	extends: [es.configs.recommended, ts.configs.recommended, ts.configs.stylistic],
});
