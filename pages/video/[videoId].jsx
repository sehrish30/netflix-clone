import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../lib/videos";
import Navbar from "../../components/nav/navbar.component";
import Like from "../../components/icons/like-icon.component";
import DisLike from "../../components/icons/dislike-icon.component";
import { useState, useEffect } from "react";

//  Make sure to bind modal to your appElement for accessibility
Modal.setAppElement("#__next");

const VideoIdPage = (initialProps) => {
  const router = useRouter();
  const videoId = router.query.videoId;
  const { video } = initialProps;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const customStyles = {
    content: {
      backgroundColor: "#181818",
    },
  };

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleToggleLike = async () => {
    const favorutied = !toggleLike;
    setToggleDisLike(toggleLike);
    setToggleLike((prev) => !prev);

    const response = await runRatingService(favorutied ? 1 : 0);
    console.log("data", await response.json());
  };

  const handleToggleDisLike = async () => {
    const Unfavorutied = !toggleDisLike;
    setToggleLike(toggleDisLike);
    setToggleDisLike((prev) => !prev);
    const response = await runRatingService(Unfavorutied ? 0 : 1);

    console.log("data", await response.json());
  };

  useEffect(() => {
    async function getStats() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();

      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDisLike(true);
        }
      }
    }
    getStats();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        style={customStyles}
        contentLabel="Watch The Video"
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          name="ytplayer"
          id="ytplayer"
          // accessibility purposes
          title="An embedded youtube video trailer for this movie"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          // restrict browser capabilities
          sandbox="allow-scripts allow-same-origin"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          // defer loading iframe
          loading="lazy"
          // disable potentially unsecured browser features
          allow="camera 'none'; microphone 'none'; payment 'none'"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoIdPage;

/**
 * Isr works
 * Get Content1: Yes -> Get cached data from cdn  -> data
 * Revalidate Time expired:
 * First time return cached data
 * Next time return New generate data in the background
 * Or if page doesnot exist
 * Fallback: Content Delivery Network (CDN)
 * SSR regenerates new page
 * updates cache
 * Fallblack: blocking -> show nothing u r confident that api returns data quickly
 * Fallback: true => show loading immediately show loader until u get data from api
 */
export async function getStaticProps(context) {
  const videoId = context.params.videoId;

  const videoArray = await getYoutubeVideoById(videoId);

  // Error: Error serializing `.video.channelTime` returned from `getStaticProps` in "/video/[videoId]"
  return {
    props: {
      video:
        videoArray.length > 0 ? JSON.parse(JSON.stringify(videoArray[0])) : {},
    },
    revalidate: 10, // in sec
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];

  const paths = listOfVideos.map((videoId) => ({
    // videoId because file has [videoId] so this should be videoId
    params: { videoId },
  }));

  return {
    paths,
    //  new paths not returned by getStaticPaths
    fallback: "blocking",
  };
}
