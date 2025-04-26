import {
  vitePlugin as remix,
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
          route(":locale/", "routes/index.tsx", { index: true });
          route(":locale/profiles/:slug/edit", "routes/profiles/edit.tsx");
          route(":locale/members/:slug", "routes/profiles/show.tsx");
          route(":locale/articles/:slug", "routes/articles/show.tsx");
          route(":locale/profiles", "routes/profiles/index.tsx", { index: true });
          route(":locale/proposals", "routes/proposals/index.tsx", { index: true });
          route(":locale/proposals/:id/edit", "routes/proposals/edit.tsx");
          route(":locale/proposals/new", "routes/proposals/new.tsx");
          route(":locale/admin/votes", "routes/admin/votes/index.tsx", { index: true });
          route(":locale/admin/articles", "routes/admin/articles/index.tsx", { index: true });
          route(":locale/admin/articles/:id/edit", "routes/admin/articles/edit.tsx");
          route(":locale/admin/articles/new", "routes/admin/articles/new.tsx");
          route(":locale/admin/roles", "routes/admin/roles/index.tsx", { index: true });
          route(":locale/admin/roles/new", "routes/admin/roles/new.tsx");
          route(":locale/admin/roles/:id", "routes/admin/roles/show.tsx");
          route(":locale/contact", "routes/contact.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
