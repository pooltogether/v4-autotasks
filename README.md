# v4-autotasks

Monorepo regrouping OpenZeppelin Defender autotasks for V4.

## Development

### Installation

This repository uses [Lerna](https://lerna.js.org/) to handle packages.

Install it globally or use `npx` to run `lerna` commands:

```
npm i -g lerna
```

Install and link dependencies across packages with:

```
lerna bootstrap
```

### Add a package

To add a package, you need to run:

```
lerna create <package_name>
```

#### Setup TypeScript

This repository uses [TypeScript](https://www.typescriptlang.org/) and each packages reference the global [tsconfig.json](./tsconfig.json).

Add the following `tsconfig.json` file in your package:

```
{
 "extends": "../../tsconfig.json",
 "compilerOptions": {
   "outDir": "./lib"
 },
 "include": [
   "./src"
 ]
}
```

#### Setup Jest

Jest is being used to run tests.

Add the following `jest.config.js` file in your package:

```
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

#### Setup package.json scripts

Once TypeScript and Jest have been setup, you need to add the following scripts to your package `package.json`:

```
"scripts": {
  "format": "prettier --config ../../.prettierrc --ignore-path ../../.prettierignore --write \"**/*.{ts,js}\"",
  "tsc": "tsc",
  "test": "jest ./__tests__/index.ts"
},
```

### Publish a package

In the root directory of this project, run the following command:

```
npm run publish
```

If it's the first time you publish this package, you will need to pass `--access public`:
```
npm run publish --access public
```

### Tests

To run unit tests across all packages, run:

```
lerna run test
```

### Code quality

[Prettier](https://prettier.io) is used to format TypeScript code. Use it by running:

```
lerna run format
```

We also use [Husky](https://typicode.github.io/husky/#/) to run pre-commit hooks which are defined in [.husky/pre-commit](.husky/pre-commit).
