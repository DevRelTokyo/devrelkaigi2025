import { useState, useEffect } from 'hono/jsx'
import { Parse } from '../parse';
import { GitHubResponse } from '../types/cloud';
interface AuthProps {
	code: string;
	redirect?: string;
};

export default function Auth({ code, redirect }: AuthProps) {
	const [user, setUser] = useState(Parse.User.current());
	const signInWithGithub = async () => {
		const response = await Parse.Cloud.run("githubAuth", { code }) as GitHubResponse;
		const authData = {
			id: response.id,
			access_token: response.access_token,
		};
		const user = await Parse.User.logInWith('github', { authData });
		if (!user) return;
		if (redirect) {
			window.location.href = redirect;
		} else {
			console.log(response);
			// window.location.href = '/';
		}
	};

	useEffect(() => {
		if (user) return;
		signInWithGithub();
	}, []);

  return (
    <div>Logged in...</div>
  )
}
