import Parse from "@goofmint/parse";

export const useParse = (appId: string, jsKey: string, serverUrl: string): Parse | null => {
	if (typeof window === "undefined") return null;
	Parse.initialize(appId, jsKey);
	Parse.serverURL = serverUrl;
	return Parse;
}

export { Parse };