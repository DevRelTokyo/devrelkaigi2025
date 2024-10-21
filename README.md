# DevRelKaigi 2025

## Development

Add `.dev.vars` file to the root of the project (From goofmint).

Run the dev server:

```sh
npm run dev
```

## Deployment

Run the following command.

```sh
npm run deploy
```

## Structure

### vite.config.ts

Routing settings are defined here.

```ts
route(":locale/", "routes/index.tsx", {index: true}); -> app/routes/index.tsx
route(":locale/profiles/:slug/edit", "routes/profiles/edit.tsx");
route(":locale/members/:slug", "routes/profiles/show.tsx");
route(":locale/profiles", "routes/profiles/index.tsx", {index: true});
route("auth/github", "routes/auth/github.tsx");
route("callback/github", "routes/callback/github.tsx");
```

### Under app

- components  
Reusable components are defined here.
- entry.client.tsx  
For browser entry. Don't touch this file.
- entry.server.tsx  
For server entry. It's moved by Cloudflare Workers.
- locales  
i18n files are defined here. Those are 'ja' and 'en'.
- parse.ts  
It will return the Parse JavaScript SDK.
- root.tsx  
Root component. `<html>` tag is defined here.
- schemas  
Schema for HTML form.
- routes  
Rooting files are defined here.
- types  
TypeScript types are defined here.
- utils  
Utility functions are defined here.


