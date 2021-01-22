import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import About from "../components/homePageFeatures/About";
// locals
import CTA from "../components/homePageFeatures/CTA";
import CTA2 from "../components/homePageFeatures/CTA2";
import Explore from "../components/homePageFeatures/Explore";
import FeaturedProjects from "../components/homePageFeatures/FeaturedProjects";
import Hero from "../components/homePageFeatures/Hero";
import HomeTeamSection from "../components/homePageFeatures/HomeTeamSection";
import SeenOn from "../components/homePageFeatures/SeenOn";
import Testimonial from "../components/homePageFeatures/Testimonial";
import TopCategories from "../components/homePageFeatures/TopCategories";
import Layout from "../components/Layout";
import Newsletter from "../components/Newsletter";
import auth0 from "./api/utils/auth0";

interface IHomeProps {
  user: any | null;
}

const Index = ({ user }: IHomeProps) => {
  return (
    <Layout user={user} SEO={{ title: "Home - VR Funds" }}>
      <Hero />
      <TopCategories />
      <CTA />
      <FeaturedProjects />
      <About />
      <Flex
        as="section"
        w="full"
        mt="-311px"
        bgColor="color_primary"
        padding="451px 0 0"
      ></Flex>
      <Explore />
      <CTA2 />
      <SeenOn />
      <Testimonial />
      <HomeTeamSection />
      <Newsletter />
    </Layout>
  );
};

export default Index;

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await auth0.getSession(req);

  if (!session?.user) {
    return { props: {} };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
