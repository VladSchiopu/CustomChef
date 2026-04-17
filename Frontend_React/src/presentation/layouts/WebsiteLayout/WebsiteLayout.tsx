import { Footer } from "../Footer";
import { MainContent } from "../MainContent";
import { Navbar } from "../Navbar";
import { memo, PropsWithChildren } from "react";

/**
 * This component should be used for all pages in the application, it wraps other components in a layout with a navigation bar and a footer.
 */
export const WebsiteLayout = memo(
  (props: PropsWithChildren<{}>) => {
    const { children } = props;

    return <div className="flex flex-col min-h-screen">
      <Navbar />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  }
);
