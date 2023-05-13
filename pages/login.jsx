import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { RPCError, RPCErrorCode } from "magic-sdk";

import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";

const Login = () => {
  const router = useRouter();
  const [userMessage, setUserMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
      setEmailSent(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      // after component gets unmounted stop loading
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  const handleLoginWithEmail = async () => {
    setUserMessage("");
    if (email) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (email.match(regex)) {
        setIsLoading(true);

        try {
          const isLoggedIn = await magic?.user?.isLoggedIn();
          console.log({ isLoggedIn });
          if (!isLoggedIn) {
            setEmailSent(true);
            const didToken = await magic.auth.loginWithMagicLink({
              email,
              showUI: false,
            });

            if (didToken) {
              console.log({ didToken });
              setEmailSent(false);
              const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${didToken}`,
                  "Content-Type": "application/json",
                },
              });
              const loggedInResponse = await response.json();
              console.log("TESt loggedInResponse", loggedInResponse);
              if (loggedInResponse.done) {
                router.replace("/");
                if (router.asPath === "/") {
                  router.reload();
                }
              } else {
                setIsLoading(false);
                setUserMessage("Something went wrong");
              }
            }
          } else {
            console.log("LOGGED IN");
            router.push("/");
          }
        } catch (err) {
          console.log(err);
          setIsLoading(false);
          if (err instanceof RPCError) {
            switch (err.code) {
              case RPCErrorCode.MagicLinkFailedVerification:
                console.log("MagicLinkFailedVerification", err);
                setUserMessage("Verification Failed");
              case RPCErrorCode.MagicLinkExpired:
                console.log("MagicLinkExpired", err);
                setUserMessage("Magic link expired");
              case RPCErrorCode.MagicLinkRateLimited:
                console.log("MagicLinkRateLimited", err);
                setUserMessage("Magic link rate exceeded");
              case RPCErrorCode.UserAlreadyLoggedIn:
                console.log("UserAlreadyLoggedIn", err);
                setUserMessage("You are already logged in");
                break;
              default:
                console.log("UNKNOWN", err);
            }
          } else {
            setUserMessage("Authentication failed");
          }
        }
      } else {
        setUserMessage("Enter a valid email address");
      }
    } else {
      setUserMessage("Enter a valid email address");
    }
  };

  const handleRedirectUserToInbox = () => {
    window.open(`mailto:${email}`);
  };
  const handleOnChangeEmail = (e) => {
    setUserMessage("");
    setEmail(e.target.value);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Signin</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src={"/static/netflix.svg"}
                alt="Netflix logo"
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type="email"
            placeholder="Email address"
            onChange={handleOnChangeEmail}
            id="email"
          />
          <p className={styles.userMsg}>{userMessage}</p>

          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
          {emailSent && (
            <div
              className={styles.important}
              onClick={handleRedirectUserToInbox}
            >
              <p className={styles.black}>Please check your email!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
