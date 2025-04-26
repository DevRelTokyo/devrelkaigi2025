// import { useRootContext } from 'remix-provider';
// import { useParse } from '../parse';
import { ParseContext } from '../contexts/parse';
import type ParseType from '@goofmint/parse';
import { GitHubResponse } from '../types/cloud';
interface AuthProps {
  code: string;
}
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Auth({ code }: AuthProps) {
  const { Parse } = useContext(ParseContext)!;
  // const Parse = useParse(env.PARSE_APP_ID, env.PARSE_JS_KEY, env.PARSE_SERVER_URL);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) return;
    signInWithGithub();
  }, []);

  if (typeof window === 'undefined') {
    return (<>Logging in...</>);
  }

  const user = Parse.User.current();
  const signInWithGithub = async () => {
    if (typeof window === 'undefined') return;
    const response = await Parse.Cloud.run("githubAuth", { code }) as GitHubResponse;
    const authData = {
      id: response.id,
      access_token: response.access_token,
    };
    const user = await Parse.User.logInWith('github', { authData });
    if (!user) return;
    // Find profile
    await findOrCreateProfile(user, response);
    const redirectPath = Cookies.get('redirect');
    Cookies.remove('redirect');
    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      window.location.href = '/';
    }
  };

  const findOrCreateProfile = async (user: ParseType.User, response: GitHubResponse) => {
    const lang = 'en';
    const query = new Parse.Query('Profile');
    query.equalTo('user', user);
    query.equalTo('lang', lang);
    const p = await query.first();
    if (p && p.id) return p;
    // Create profile
    const profile = new Parse.Object('Profile');
    profile.set('user', user);
    profile.set('name', response.name);
    profile.set('email', response.email);
    profile.set('image_url', response.avatar_url);
    profile.set('profile', response.bio);
    profile.set('organization', response.company);
    profile.set('slug', response.login);
    profile.set('lang', lang);
    const socials: string[] = [response.html_url];
    if (response.blog) socials.push(response.blog);
    if (response.twitter_username) socials.push(`https://x.com/${response.twitter_username}`);
    profile.set('socials', socials);
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setWriteAccess(user, true);
    acl.setRoleWriteAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
    profile.setACL(acl);
    await profile.save();
    return profile;
  };

  return (
    <div>Logged in...</div>
  )
}
