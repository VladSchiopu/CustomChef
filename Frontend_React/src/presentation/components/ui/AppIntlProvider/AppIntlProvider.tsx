import { getMessagesForLanguage } from "presentation/assets/lang";
import { useLanguageState } from "application/context/LanguageContextProvider";
import { PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";

/**
 * This component is used to make the internationalization available to the components it wraps.
 */
export const AppIntlProvider = ({ children }: PropsWithChildren) => {
  const { selectedLanguage } = useLanguageState();

  return <IntlProvider
    messages={getMessagesForLanguage(selectedLanguage)}
    locale={selectedLanguage}
    defaultLocale={import.meta.env.VITE_DEFAULT_LOCALE}
  >
    {children}
  </IntlProvider>
};
