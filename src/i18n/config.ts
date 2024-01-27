import { InitOptions } from 'i18next';
import { en } from './en';
import { ja } from './ja';

export const i18nextInitOptions: InitOptions = {
  lng: 'ja',
  fallbackLng: 'ja',
  resources: {
    en,
    ja,
  },
};

const i18nConfig = {
  locales: ['en', 'ja'],
  defaultLocale: 'ja',
};

export default i18nConfig;
