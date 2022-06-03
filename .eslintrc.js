module.exports = {
  plugins: ['@typescript-eslint'],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier" // Add "prettier" last. This will turn off eslint rules conflicting with prettier. This is not what formats the code.
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-img-element": "off"
  }
}
