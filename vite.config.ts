import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    mdx(),
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
          route(":locale/proposals/:id", "routes/proposals/show.tsx");
          route(":locale/members/:slug", "routes/profiles/show.tsx");
          route(":locale/articles/:slug", "routes/articles/show.tsx");
          route(":locale/profiles", "routes/profiles/index.tsx", {
            index: true,
          });
          route(":locale/proposals", "routes/proposals/index.tsx", {
            index: true,
          });
          route(":locale/proposals/:id/edit", "routes/proposals/edit.tsx");
          route(
            ":locale/proposals/:id/response",
            "routes/proposals/response.tsx"
          );
          route(":locale/proposals/new", "routes/proposals/new.tsx");
          route(":locale/organizers/:slug", "routes/organizers/show.tsx");
          route(":locale/speakers/:slug", "routes/speakers/show.tsx");
          route(":locale/admin/votes", "routes/admin/votes/index.tsx", {
            index: true,
          });
          route(":locale/admin/proposals", "routes/admin/proposals/index.tsx", {
            index: true,
          });
          route(":locale/admin/articles", "routes/admin/articles/index.tsx", {
            index: true,
          });
          route(
            ":locale/admin/articles/:id/edit",
            "routes/admin/articles/edit.tsx"
          );
          route(":locale/admin/articles/new", "routes/admin/articles/new.tsx");
          route(":locale/admin/roles", "routes/admin/roles/index.tsx", {
            index: true,
          });
          route(":locale/admin/roles/new", "routes/admin/roles/new.tsx");
          route(":locale/admin/roles/:id", "routes/admin/roles/show.tsx");
          route(":locale/admin/templates", "routes/admin/templates/index.tsx", {
            index: true,
          });
          route(
            ":locale/admin/templates/:id/edit",
            "routes/admin/templates/edit.tsx"
          );
          route(
            ":locale/admin/templates/new",
            "routes/admin/templates/new.tsx"
          );
          route(":locale/admin/sponsors", "routes/admin/sponsors/index.tsx", {
            index: true,
          });
          route(
            ":locale/admin/sponsors/:id/edit",
            "routes/admin/sponsors/edit.tsx"
          );
          route(":locale/admin/sponsors/new", "routes/admin/sponsors/new.tsx");
          route(":locale/admin/speakers", "routes/admin/speakers/index.tsx", {
            index: true,
          });
          route(
            ":locale/admin/profiles/:id/edit",
            "routes/admin/profiles/edit.tsx"
          );
          route(":locale/contact", "routes/contact.tsx");
          route(":locale/supporter", "routes/supporter.tsx");
          route(":locale/:page", "routes/page.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
