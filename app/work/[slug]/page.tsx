import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactFooter } from "@/components/ContactFooter";
import { MotionRoot } from "@/components/MotionRoot";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeView } from "@/components/ThemeView";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.title} — Pablo Cuerva`, description: p.pitch } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <MotionRoot>
      <SiteHeader />
      <main>
        <ThemeView key={project.slug} project={project} next={next} />
      </main>
      <ContactFooter />
    </MotionRoot>
  );
}
