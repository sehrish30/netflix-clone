import { useState } from "react";
import Image from "next/image";
import styles from "./card.module.css";
import { motion } from "framer-motion";
import cls from "classnames";

const Card = ({
  imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80",
  size = "medium",
  id = 0,
  shouldScale = true,
}) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  // Image component error handling
  const handleOnError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80"
    );
  };

  // overlay on top of others
  // not to go outside of screen
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const shouldHover = shouldScale && {
    whileHover: { ...scale },
  };
  return (
    <div className={styles.container}>
      <motion.div
        // whileHover={{ ...scale }}
        {...shouldHover}
        className={cls(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          alt="new"
          src={imgSrc}
          fill
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
