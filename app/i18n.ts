import i18next from 'i18next';
import ja from './locales/ja.json';
import en from './locales/en.json';
import { Context } from 'hono';

const getLang = (path: string) => {
	return path.split('/')[1] === 'ja' ? 'ja' : 'en';
};

const setLang = (lang: string) => {
  i18next.init({
    debug: false,
    resources: {
      en: {
        translation: en,
      },
      ja: {
        translation: ja,
      }
    }
  });
  i18next.changeLanguage(lang);
  return i18next;
};

const useI18n = (path: string) => {
	const lang = getLang(path);
  return setLang(lang);
};

export { useI18n, getLang, setLang };
