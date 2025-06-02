import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever pathname changes, scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // ⚡ fast scroll without animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
