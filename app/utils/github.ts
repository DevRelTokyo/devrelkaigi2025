export const signInWithGithub = async () => {
	if (typeof window === 'undefined') return;
	window.location.href = `/auth/github?redirect=${encodeURIComponent(window.location.pathname)}`;
};
