import { vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
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
          route(":locale/proposals", "routes/proposals/index.tsx", {index: true});
          route(":locale/proposals/:id/edit", "routes/proposals/edit.tsx");
          route(":locale/proposals/new", "routes/proposals/new.tsx");
          route(":locale/admin/blog", "routes/admin/blog/index.tsx", {index: true});
          route(":locale/admin/blog/:slug/edit", "routes/admin/blog/edit.tsx");
          route(":locale/admin/blog/new", "routes/admin/blog/new.tsx");
          route(":locale/contact", "routes/contact.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
