import { initializeApp } from 'firebase/app';
import { getAdditionalUserInfo, getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, User, UserCredential } from 'firebase/auth';
import React, { useState, ReactNode, useEffect, useContext } from 'react';
import type Parse from 'parse';
import { ParseContext } from './parse';

type UserContextType = {
  user: Parse.User | undefined;
  setUser: (user: Parse.User) => void;
  profile: Parse.Object | undefined;
  setProfile: (profile: Parse.Object) => void;
  logout: () => void;
  login: (provider: string) => void;
  admin: boolean;
} | null

type UserContextProviderProps = {
  children: ReactNode;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId: string;
}

export const UserContext = React.createContext<UserContextType>(null);

export function UserProvider(params: UserContextProviderProps) {
  const firebaseConfig = {
    apiKey: params.firebaseApiKey,
    authDomain: params.firebaseAuthDomain,
    projectId: params.firebaseProjectId,
    storageBucket: params.firebaseStorageBucket,
    messagingSenderId: params.firebaseMessagingSenderId,
    appId: params.firebaseAppId,
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

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

  const login = async (provider: string) => {
    if (provider === 'github') {
      await loginWithGithub();
    } else {
      await loginWithGoogle();
    }
  }

  const loginWithGithub = async () => {
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

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const { user } = result;
    const authData = {
      id: user.providerData[0].uid,
      id_token: credential?.idToken,
      access_token: credential?.accessToken,
    };
    await Parse.User.logInWith('google', { authData });
    updateProfile(result);
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
      query.equalTo('lang', 'en');
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

	const updateProfile = async (result: UserCredential) => {
    const { user } = result;
    console.log(user, result);
		const currentUser = Parse.User.current();
		if (!currentUser) return;
		currentUser.set('email', user.email);
		await currentUser.save();
		const profile = await getProfile() || new Parse.Object('Profile');
		const info = getAdditionalUserInfo(result);
		profile.set('user', currentUser);
    profile.set('lang', 'en');
		profile.set('name', user.displayName);
		profile.set('image_url', user.photoURL);
    profile.set('slug', (info?.username || (info?.profile?.given_name as string))?.toLowerCase());
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
      {params.children}
    </UserContext.Provider>
  );
}