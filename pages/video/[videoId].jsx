import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";

//  Make sure to bind modal to your appElement for accessibility
Modal.setAppElement("#__next");

const VideoIdPage = (initialProps) => {
  const router = useRouter();
  const videoId = router.query.videoId;
  const { video } = initialProps;

  const customStyles = {
    content: {
      backgroundColor: "#181818",
    },
  };

  const { title, publishTime, description, channelTitle, viewCount } = video;

  return (
    <div className={styles.modal}>
      <Modal
        isOpen={true}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => router.back()}
        style={customStyles}
        contentLabel="Watch The Video"
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>
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
export async function getStaticProps() {
  const video = {
    title: "Hi cute dog",
    publishTime: "1990-01-01",
    description: "A big red dog",
    channelTitle: "Paramount picture",
    viewCount: 1000,
  };

  return {
    props: {
      video,
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
    fallback: "blocking",
  };
}
