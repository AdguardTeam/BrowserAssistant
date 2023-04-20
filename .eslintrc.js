module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    parserOptions: {
        project: ['tsconfig.eslint.json'],
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', { code: 120, ignoreUrls: true }],
        '@typescript-eslint/indent': ['error', 4],
        'import/prefer-default-export': 0,
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    './scripts/**',
                ],
                peerDependencies: true,
            },
        ],
        'arrow-body-style': 0,
        'react/jsx-filename-extension': 0,
        '@typescript-eslint/no-shadow': 0,
    },
};
