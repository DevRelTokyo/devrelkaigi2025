import { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { RootProvider, RootValue } from "remix-provider";

import bootstrap from "bootstrap/dist/css/bootstrap.min.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: bootstrap },
  { rel: "stylesheet", href: "/assets/style.css" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <style>{bootstrap}</style>
          <Links />
          <RootValue />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </RootProvider>
  );
}

export default function App() {
  return <Outlet />;
}
