import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

export const app = new Elysia()
  .use(
    await staticPlugin({
      prefix: '/'
    })
  )
  .get('/message', { message: 'Hello from server' } as const)
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
