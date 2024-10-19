import { useState, useEffect } from 'hono/jsx'
import { Parse } from '../parse';
import { GitHubResponse } from '../types/cloud';
interface AuthProps {
	code: string;
	redirect?: string;
};

export default function Auth({ code, redirect }: AuthProps) {
	const user = Parse.User.current();
	const signInWithGithub = async () => {
		const response = await Parse.Cloud.run("githubAuth", { code }) as GitHubResponse;
		const authData = {
			id: response.id,
			access_token: response.access_token,
		};
		const user = await Parse.User.logInWith('github', { authData });
		if (!user) return;
		// Find profile
		const profile =	await findOrCreateProfile(user, response);
		if (redirect) {
			window.location.href = redirect;
		} else {
			window.location.href = '/';
		}
	};

	const findOrCreateProfile = async (user: Parse.User, response: GitHubResponse) => {
		const query = new Parse.Query('Profile');
		query.equalTo('user', user);
		const p = await query.first();
		if(p && p.id) return p;
		// Create profile
		const profile = new Parse.Object('Profile');
		profile.set('user', user);
		profile.set('name', response.name);
		profile.set('email', response.email);
		profile.set('image_url', response.avatar_url);
		profile.set('profile', response.bio);
		profile.set('organization', response.company);
		profile.set('lang', 'en');
		const socials: {name: string, url: string}[] = [
			{name: 'github', url: `${response.html_url}`},
		];
		if (response.blog) socials.push({name: 'blog', url: response.blog});
		if (response.twitter_username) socials.push({name: 'twitter', url: `https://x.com/${response.twitter_username}`});
		profile.set('socials', socials);
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setWriteAccess(user, true);
		acl.setRoleWriteAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
		profile.setACL(acl);
		await profile.save();
		return profile;
	};

	useEffect(() => {
		if (user) return;
		signInWithGithub();
	}, []);

  return (
    <div>Logged in...</div>
  )
}
