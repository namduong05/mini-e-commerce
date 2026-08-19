import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import viTranslation from "./locales/vi.json";
import enTranslation from "./locales/en.json";

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: viTranslation },
      en: { translation: enTranslation },
    },
    fallbackLng: "vi", // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
