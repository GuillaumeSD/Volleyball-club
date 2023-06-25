# RAC Volley Backend

Backend is built with serverless [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) [Firebase cloud functions](https://firebase.google.com/docs/functions).

Project's database is [Firestore](https://firebase.google.com/docs/firestore).

## Getting Started

All npm commands must be run from the backend directory.

First, you need at least node18 & npm installed on your machine. Then, you can install the dependencies :

```bash
npm ci
```

Then, you can run the development server :

```bash
npm run dev
```

The development server will automatically reload if you change any of the source files.

## Lint

ESLint is configured with this project. You can run it with :

```bash
npm run lint
```

## Deploy

To deploy the app, you first need to install the firebase CLI, then run :

```bash
npm run deploy
```
