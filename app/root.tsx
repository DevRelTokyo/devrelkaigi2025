import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { CookiesProvider } from "react-cookie";
import { ParseProvider } from "~/contexts/parse";
import { SSRBodyRoot, SSRProvider, SSRWait } from "next-ssr";
import { RemixHeadProvider, RemixHeadRoot } from "remix-head";
import { UserProvider } from '~/contexts/user';
import { CookieProvider } from "~/contexts/cookie";

export interface Env {
  PARSE_APP_ID: string;
  PARSE_JS_KEY: string;
  PARSE_SERVER_URL: string;
  YEAR: number;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
}

declare global {
  interface Window {
    ENV: Env;
  }
}
import bootstrap from "bootstrap/dist/css/bootstrap.min.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: bootstrap },
  { rel: "stylesheet", href: "/assets/style.css" },
];
export const loader = ({ context }: LoaderFunctionArgs) => {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  return json({
    ENV: {
      PARSE_APP_ID: env.PARSE_APP_ID,
      PARSE_JS_KEY: env.PARSE_JS_KEY,
      PARSE_SERVER_URL: env.PARSE_SERVER_URL,
      YEAR: env.YEAR,
      FIREBASE_API_KEY: env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: env.FIREBASE_MEASUREMENT_ID,
    },
  });
};
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  return (
    <RemixHeadProvider>
      <html lang="en">
        <SSRProvider>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/assets/favicon.ico" type="image/x-icon"></link>
            <Meta />
            <style>{bootstrap}</style>
            <Links />
            <SSRWait>
              <RemixHeadRoot />
            </SSRWait>
          </head>
          <body>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify({
                  YEAR: data.ENV.YEAR,
                })}`,
              }}
            />
            <CookiesProvider>
              <CookieProvider>
                <ParseProvider
                  appId={data.ENV.PARSE_APP_ID}
                  jsKey={data.ENV.PARSE_JS_KEY}
                  serverUrl={data.ENV.PARSE_SERVER_URL}
                >
                  <UserProvider
                    firebaseApiKey={data.ENV.FIREBASE_API_KEY}
                    firebaseAuthDomain={data.ENV.FIREBASE_AUTH_DOMAIN}
                    firebaseProjectId={data.ENV.FIREBASE_PROJECT_ID}
                    firebaseStorageBucket={data.ENV.FIREBASE_STORAGE_BUCKET}
                    firebaseMessagingSenderId={data.ENV.FIREBASE_MESSAGING_SENDER_ID}
                    firebaseAppId={data.ENV.FIREBASE_APP_ID}
                    firebaseMeasurementId={data.ENV.FIREBASE_MEASUREMENT_ID}
                  >
                    {children}
                    <SSRBodyRoot />
                  </UserProvider>
                </ParseProvider>
              </CookieProvider>
            </CookiesProvider>
            <ScrollRestoration />
            <Scripts />
          </body>
        </SSRProvider>
      </html>
    </RemixHeadProvider>
  );
}

export default function App() {
  return <Outlet />;
}
