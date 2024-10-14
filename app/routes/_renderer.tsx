import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link href="/static/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href='/static/style.css'></link>
        <link rel="icon" href="/favicon.ico" />
        <script src="/static/popper.min.js"></script>
        <script src="/static/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <Script src="/app/client.ts" async />
        <Style />
      </head>
      <body>{children}</body>
    </html>
  )
})
