import { builtinModules } from 'module'
import type { Plugin, UserConfig } from 'vite'

export const nodeServerPlugin = (): Plugin => {
  const virtualEntryId = 'virtual:node-server-entry-module'
  const resolvedVirtualEntryId = '\0' + virtualEntryId

  return {
    name: '@hono/vite-node-server',
    resolveId(id) {
      if (id === virtualEntryId) {
        return resolvedVirtualEntryId
      }
    },
    async load(id) {
      if (id === resolvedVirtualEntryId) {
        return `import { Hono } from 'hono'
        import { serveStatic } from '@hono/node-server/serve-static'
        import { serve } from '@hono/node-server'
        import { logger } from 'hono/logger'
        
        const worker = new Hono()
        worker.use(logger())
        worker.use('/assets/*', serveStatic({root: './dist'}))
        worker.use('/static/*', serveStatic({root: './dist'}))
        const modules = import.meta.glob(['/app/server.ts'], { import: 'default', eager: true })
        for (const [, app] of Object.entries(modules)) {
          if (app) {
						worker.get('/', (c) => {
							const lang = c.req.header('accept-language')
								.split(',')[0]
								.split('-')[0];
							return c.redirect(lang === 'ja' ? '/ja' : '/en');
						});
						worker.route('/', app)
            worker.notFound(app.notFoundHandler)
          }
        }
        const port = process.env.PORT || 3000
        serve({ ...worker, port }, info => {
          console.log('Listening on http://localhost:'+info.port)
        })`
      }
    },
    config: async (): Promise<UserConfig> => {
      return {
        ssr: {
          external: [],
          noExternal: true,
        },
        build: {
          outDir: './dist',
          emptyOutDir: false,
          minify: true,
          ssr: true,
          rollupOptions: {
            external: [...builtinModules, /^node:/],
            input: virtualEntryId,
            output: {
              entryFileNames: 'server.mjs',
            },
          },
        },
      }
    },
  }
}

export default nodeServerPlugin