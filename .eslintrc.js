module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript"
    ],
    "parser": '@typescript-eslint/parser',
    "plugins": ["@typescript-eslint"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                "*.ts",
                "*.tsx"
            ],
            "parserOptions": {
                "sourceType": "script"
            },
            "extends": [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project":"./tsconfig.eslint.json"
    },
    "rules": {
        
    }
}
