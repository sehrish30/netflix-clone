import Head from "next/head";
import SectionCards from "../../components/card/section-cards.component";
import Navbar from "../../components/nav/navbar.component";
import { getMyList } from "../../lib/videos";
import styles from "../../styles/MyList.module.css";
import redirectUser from "../../utils/redirectUser";

const MyList = (initialProps) => {
  const { myListVideos } = initialProps;
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { userId, token } = await redirectUser(ctx);

  // if (!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  const videos = await getMyList(userId, token);
  return {
    props: {
      myListVideos: videos,
    },
  };
}

export default MyList;
