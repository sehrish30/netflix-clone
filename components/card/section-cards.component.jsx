import React from "react";
import Card from "./card.component";
import styles from "./section-cards.module.css";
import clsx from "classnames";
import Link from "next/link";

const SectionCards = ({
  title,
  videos = [],
  size,
  shouldWrap = false,
  shouldScale,
}) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <Card
              shouldScale={shouldScale}
              id={index}
              imgUrl={video.imgUrl}
              size={size}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
