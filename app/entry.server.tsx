/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerProvider } from "remix-provider";
import { ENV } from "./types/env";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const { env } = (loadContext as { cloudflare: ENV }).cloudflare;
  const url = new URL(request.url);
  if (url.pathname === '/') {
    const language = request.headers.get("accept-language");
    const lang = language && language.split(',')[0] === 'ja' ? 'ja' : 'en';
    return redirect(`/${lang}`);
  }
  if (url.pathname === '/auth/github') {
    const redirectPath = url.searchParams.get('redirect');
    const headers = redirectPath ? {
      "Set-Cookie": `redirect=${redirectPath}; Path=/; Secure; SameSite=Strict;`,
    } : undefined;
    return redirect(
      `https://github.com/login/oauth/authorize?scope=user:email&client_id=${env.GITHUB_CLIENT_ID}`,
      { headers }
    );
  }
  const body = await renderToReadableStream(
    <ServerProvider
      value={{
        env,
        host: request.headers.get("host"),
      }}
    >
      <RemixServer context={remixContext} url={request.url} />
    </ServerProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}