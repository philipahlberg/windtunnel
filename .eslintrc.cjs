module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"prettier",
		"plugin:prettier/recommended",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],
	root: true,
	ignorePatterns: ["**/dist/*"],
	rules: {
		"@typescript-eslint/no-unused-vars": ["off"],
	},
};
