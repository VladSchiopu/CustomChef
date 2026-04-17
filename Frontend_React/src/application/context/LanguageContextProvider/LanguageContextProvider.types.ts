import { SupportedLanguage } from "presentation/assets/lang";

export type LanguageState = {
  selectedLanguage: SupportedLanguage;
};

export type LanguageAPI = {
  setRomanian: () => void;
  setEnglish: () => void;
};

export type LanguageContextActions =
  | { type: "setRomanianLanguage" }
  | { type: "setEnglishLanguage" };
