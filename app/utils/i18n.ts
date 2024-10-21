import i18n from 'i18next';
import ja from '../locales/ja.json';
import en from '../locales/en.json';

const setLang = (lang: string) => {
  if (i18n.isInitialized) return i18n;
  i18n.init({
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
  i18n.changeLanguage(lang);
  return i18n;
};

export { setLang };
