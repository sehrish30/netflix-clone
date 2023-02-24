import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import Loader from "../components/loading/loading.component";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    // solve flicker problem by subscribing to login
    // by subscribing to router events
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    async function userIsLogged() {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
    // userIsLogged();
  }, [router.events]);
  return isLoading ? <Loader /> : <Component {...pageProps} />;
}

export default MyApp;
