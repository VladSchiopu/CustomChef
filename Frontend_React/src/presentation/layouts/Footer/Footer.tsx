/**
 * Here we have a simple footer container that will stay on the bottom of the page.
 */
export const Footer = () => {
  const year = new Date().getFullYear();

  return <div className="bottom-0 flex items-center justify-center border-t-gray-500 border-t-[1px]">
          <span className="align-middle border-solid p-[1.5rem]">
            &copy; {year} • All rights reserved
          </span>
  </div>
};
