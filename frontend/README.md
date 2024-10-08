# Frontend

Frontend is built with [Next.js](https://nextjs.org/docs), [React](https://react.dev/learn/describing-the-ui), [Material UI](https://mui.com/material-ui/getting-started/overview/), and [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

It is deployed on [Firebase](https://firebase.google.com/docs/hosting), you can see it live [here](https://rac-volley.web.app).

Project's database is [Firestore](https://firebase.google.com/docs/firestore).

## Getting Started

First, you need at least node18 & npm installed on your machine. Then, you can install the dependencies :

```bash
npm ci
```

Then, you can run the development server :

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

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
