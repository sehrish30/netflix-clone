import { useState } from "react";
import Image from "next/image";
import styles from "./card.module.css";
import { motion } from "framer-motion";
import cls from "classnames";

const Card = ({
  imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80",
  size = "medium",
}) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  // Image component error handling
  const handleOnError = () => {
    console.log("ERROR");
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80"
    );
  };

  return (
    <div className={styles.container}>
      <motion.div
        whileHover={{
          scale: 1.2,
          // overlay on top of others
          // not to go outside of screen
        }}
        className={cls(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          alt="new"
          src={imgSrc}
          layout="fill"
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
