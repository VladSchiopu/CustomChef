/// <reference types="vite/client" />
/* 
 * You can add here new environment variable that can be used in the code.
 */
interface ImportMetaEnv {
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
