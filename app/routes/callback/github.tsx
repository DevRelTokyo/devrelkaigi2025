import { createRoute } from 'honox/factory'
import { deleteCookie, getCookie } from 'hono/cookie'

import { Hono } from 'hono'
import Auth from '../../islands/auth';

const app = new Hono()

export default createRoute((c) => {
	const code = c.req.query('code');
	const redirect = getCookie(c, 'redirect');
	if (!code) {
		c.status(400);
		return c.render('Bad Request');
	}
	deleteCookie(c, 'redirect');
	return c.render(<Auth
		code={code}
		redirect={redirect}
	/>);
});
