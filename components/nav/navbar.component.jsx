import { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const Navbar = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [DIDToken, setDIDToken] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        const { email, publicAddress } = await magic.user.getMetadata();
        const DIDToken = await magic.user.getIdToken();
        // console.log({ DIDToken });
        setDIDToken(DIDToken);

        if (email) {
          setUsername(email);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, []);

  const toggleDropDown = () => {
    setShowDropDown((prev) => !prev);
  };

  // const handleSignOut = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await magic.user.logout();
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   router.replace("/login");
  // };
  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DIDToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.redirect) {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error logging out", error);
      router.replace("/login");
    }
  };

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropDown = () => {
    toggleDropDown();
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button onClick={handleShowDropDown} className={styles.usernameBtn}>
              <p className={styles.username}>
                {username}
                <Image
                  src={"/static/expand_more.svg"}
                  width={24}
                  height={24}
                  alt="Expand dropdown"
                />
              </p>
              {/* Expand more icon */}
            </button>
            {showDropDown && (
              <div className={styles.navDropdown}>
                <div>
                  <button onClick={handleSignOut} className={styles.linkName}>
                    Sign out
                  </button>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
