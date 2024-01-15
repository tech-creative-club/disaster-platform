import { InitOptions } from "i18next";
// import { en } from "@/i18n/dictionaries/en";
import { ja } from "@/i18n/dictionaries/ja";

export const i18nConfig = {
    // locales: ["ja", "en"],
    locales: ["ja"],
    defaultLocale: "ja",
};

export const i18nextInitOptions: InitOptions = {
    lng: "ja",
    fallbackLng: "ja",
    resources: {
    //  en,
      ja,
    },
  };