import { initializeApp } from 'firebase/app';
import { getAdditionalUserInfo, getAuth, GithubAuthProvider, signInWithPopup, User, UserCredential } from 'firebase/auth';
import React, { useState, ReactNode, useEffect, useContext } from 'react';
import type Parse from 'parse';
import { ParseContext } from './parse';

type UserContextType = {
  user: Parse.User | undefined;
  setUser: (user: Parse.User) => void;
  profile: Parse.Object | undefined;
  setProfile: (profile: Parse.Object) => void;
  logout: () => void;
  login: () => void;
  admin: boolean;
} | null

const firebaseConfig = {
  apiKey: "AIzaSyBqx8NSvC1OQP6zAiDaHsqSP4L3Q3we3h0",
  authDomain: "moongift-dev.firebaseapp.com",
  projectId: "moongift-dev",
  storageBucket: "moongift-dev.firebasestorage.app",
  messagingSenderId: "151965811101",
  appId: "1:151965811101:web:b3906c69933f8255cdaf74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const UserContext = React.createContext<UserContextType>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { Parse } = useContext(ParseContext)!;
  const [user, setUser] = useState<Parse.User | undefined>(Parse.User.current());
  const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!user) return;
    getRole();
  }, [user]);

  const logout = () => {
    try {
      Parse.User.logOut();
    } catch (error) {
      // console.error('Error logging out', error);
    }
    setUser(undefined);
		setProfile(undefined);
  };

  const login = async () => {
		const provider = new GithubAuthProvider();
		const result = await signInWithPopup(auth, provider)
		const credential = GithubAuthProvider.credentialFromResult(result);
		const { user } = result;
		const authData = {
			id: user.providerData[0].uid,
			access_token: credential?.accessToken,
		};
		await Parse.User.logInWith('github', { authData });
		updateProfile(user, result);
		setUser(Parse.User.current());
  };

	const getProfile = async () => {
		try {
      const user = Parse.User.current();
      if (!user) {
        setUser(undefined);
        setProfile(undefined);
        return;
      }
			const query = new Parse.Query('Profile');
			query.equalTo('user', user);
			const profile = await query.first();
			setProfile(profile);
			return profile;
		} catch (error) {
      logout();
    }
		return undefined;
	};

  const getRole = async () => {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    const roles = await query.find();
    setAdmin(!!roles.find(role => role.get('name') === 'admin'));
  }

	const updateProfile = async (user: User, result: UserCredential) => {
		const currentUser = Parse.User.current();
		if (!currentUser) return;
		currentUser.set('email', user.email);
		await currentUser.save();
		const profile = await getProfile() || new Parse.Object('Profile');
		const info = getAdditionalUserInfo(result);
		profile.set('user', currentUser);
		profile.set('name', user.displayName);
		profile.set('avatar', user.photoURL);
		profile.set('username', info?.username);
		// ACL
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setWriteAccess(currentUser, true);
		profile.setACL(acl);
		await profile.save();
	};

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      logout,
      login,
      profile,
      setProfile,
      admin,
    }}>
      {children}
    </UserContext.Provider>
  );
}