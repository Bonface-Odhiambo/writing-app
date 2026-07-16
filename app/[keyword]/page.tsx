import { Container } from "@/components/container";
import Hero from "@/components/hero";
import LogoClouds from "@/components/logo-clouds";
import { Header } from "@/components/header";
import BeforeAfter from "@/components/before-after";
import AccordionFeatures from "@/components/accordion-features";
import Pricing from "@/components/pricing";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import CTA from "@/components/cta";
import { getSEOTags } from "@/lib/seo";
import { keywords } from "./keywords";
import { redirect } from "next/navigation";
import keywordConfigs from "./keywordConfig";

export const generateMetadata = ({
  params,
}: {
  params: { keyword: string };
}) => {
  return getSEOTags({
    title: `Eclipse for ${params.keyword}`,
    description: `Eclipse helps with ${params.keyword}. Quick order handling, fast funds access, and great paper quality.`,
    canonicalUrlRelative: `/${params.keyword}`,
  });
};

export async function generateStaticParams() {
  return keywords.map((keyword) => ({
    keyword: keyword.replace(/\s+/g, "-").toLowerCase(),
  }));
}
function isValidKeyword(keyword: string): boolean {
  return keywords
    .map((k) => k.replace(/\s+/g, "-").toLowerCase())
    .includes(keyword.toLowerCase());
}

export default function KeywordPage({
  params,
}: {
  params: { keyword: string };
}) {
  if (!isValidKeyword(params.keyword)) {
    return redirect("/");
  }
  //Use the decoded keyword when needed
  const decodedKeyword = decodeURIComponent(params.keyword).replace(/-/g, " ");
  const config = keywordConfigs[params.keyword] || {};

  return (
    <Container>
      <Header />
      <Hero config={config.Hero} />
      <LogoClouds />
      <AccordionFeatures config={config.AccordionFeatures} />
      <BeforeAfter config={config.BeforeAfter} />
      <Pricing config={config.Pricing} />
      <FAQ config={config.FAQ} />
      <CTA config={config.CTA} />
      <Footer />
    </Container>
  );
}
