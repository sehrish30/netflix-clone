import Head from "next/head";
import Banner from "../components/banner/banner.component.jsx";
import SectionCards from "../components/card/section-cards.component.jsx";
import Navbar from "../components/nav/navbar.component.jsx";
import { getVideos, getPopularVideos, getWatchItAgain } from "../lib/videos.js";
import styles from "../styles/Home.module.css";

export default function Home(initialProps) {
  const {
    disneyVideos,
    travelVideos,
    productivityVideos,
    popularVideos,
    watchItAgainVideos,
  } = initialProps;

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Navbar />
        <Banner
          title="Clify"
          subTitle="Very subtitle"
          imgUrl="/static/clifford.webp"
          videoId="4zH5iYM4wJo"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards size="large" title="Disney" videos={disneyVideos} />
          <SectionCards
            size="small"
            title="Watch it again"
            videos={watchItAgainVideos}
          />
          <SectionCards size="small" title="Travel" videos={travelVideos} />
          <SectionCards
            size="medium"
            title="Productivity"
            videos={productivityVideos}
          />
          <SectionCards size="small" title="Popular" videos={popularVideos} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  console.log({ ctx });
  //access the token from cookie
  const userId = "did:ethr:0xa21820FCAba04e20fd4902d1275139BcD44081E6";
  const token = ctx.req?.cookies?.token;
  // get videos on server side and pass it as props to page
  const disneyVideos = await getVideos("disney");
  const travelVideos = await getVideos("Productivity");
  const productivityVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();
  const watchItAgainVideos = await getWatchItAgain(userId, token);
  console.log({ watchItAgainVideos });
  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}
