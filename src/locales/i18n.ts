import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './lang/en';
import ko from './lang/ko';

export const fallbackLng = 'ko';
export const fallbackLngs = ['ko', 'en'];

i18n
  // 사용자 언어 감지
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // i18n 인스턴스를 react-i18next에 전달합니다.
  .use(initReactI18next)
  // i18next 초기화

  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en,
      ko,
    },

    fallbackLng: fallbackLng,
    supportedLngs: fallbackLngs,
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    react: {
      bindI18n: 'languageChanged',
    },
  });

export default i18n;
