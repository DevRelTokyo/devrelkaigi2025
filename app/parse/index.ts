import Parse from '@goofmint/parse';

Parse.initialize(import.meta.env.VITE_PARSE_APP_ID, import.meta.env.VITE_PARSE_JS_KEY);
Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL;
export { Parse };
