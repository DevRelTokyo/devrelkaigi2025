import { createRoute } from 'honox/factory'
import {
  setCookie,
} from 'hono/cookie'

export default createRoute((c) => {
	const redirect = c.req.query('redirect');
	if (redirect) {
		setCookie(c, 'redirect', redirect);
	}
  return c.redirect(`https://github.com/login/oauth/authorize?scope=user:email&client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`);
});
