import { useState } from "react";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const Navbar = ({ username }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const router = useRouter();

  const toggleDropDown = () => {
    setShowDropDown((prev) => !prev);
  };

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/my-list");
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

        <p>{username}</p>
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
                  <Link href="/login" className={styles.linkName}>
                    Sign out
                  </Link>
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
