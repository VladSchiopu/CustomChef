import ro from "./ro";
import en from "./en";

export enum SupportedLanguage {
  EN = "en",
  RO = "ro",
}

type ReactIntlMessages = {
  en: Record<string, string>;
  ro: Record<string, string>;
};

const messages: ReactIntlMessages = {
  en,
  ro,
};

/**
 * Add any message IDs in its corresponding JSON file for each language to be used here to replace it with the translation via this function.
 */
export const getMessagesForLanguage = (language: SupportedLanguage) =>
  messages[language];
