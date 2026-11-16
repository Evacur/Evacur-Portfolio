import { ContactFooter } from "@/components/ContactFooter";
import { Expertises } from "@/components/Expertises";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { MotionRoot } from "@/components/MotionRoot";

/** Accueil : arrivée, expertises, questions, contact. */
export default function Page() {
  return (
    <MotionRoot>
      <SiteHeader hideLogoUntilScroll />
      <main>
        <Hero />
        <Expertises />
        <Faq />
      </main>
      <ContactFooter />
    </MotionRoot>
  );
}
