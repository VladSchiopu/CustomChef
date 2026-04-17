import { memo } from "react";
import { SeoProps } from "./Seo.types";

/**
 * This adds some Search Engine Optimization by adding the title and some metadata on each page. 
 */
export const Seo = memo((props: SeoProps) => {
  const { title = import.meta.env.VITE_APP_TITLE } = props;

  return <>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <link rel="canonical" href="http://localhost.myapp" />
    </>
});
