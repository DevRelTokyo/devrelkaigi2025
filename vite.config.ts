import build from '@hono/vite-build/cloudflare-pages'
import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import client from 'honox/vite/client'
import nodeServerPlugin from './vite-node-server-plugin'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()],
    }
  } else {
    return {
      plugins: [
        honox({ devServer: { adapter } }),
        nodeServerPlugin(),
        mdx({ jsxImportSource: 'hono/jsx' }),
      ],
    }
  }
});
