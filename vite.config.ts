import { vitePlugin as remix, cloudflareDevProxyVitePlugin } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}


export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route(":locale/", "routes/index.tsx", {index: true});
          route(":locale/profiles/:slug/edit", "routes/profiles/edit.tsx");
          route(":locale/members/:slug", "routes/profiles/show.tsx");
          route(":locale/profiles", "routes/profiles/index.tsx", {index: true});
          route("auth/github", "routes/auth/github.tsx");
          route("callback/github", "routes/callback/github.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
