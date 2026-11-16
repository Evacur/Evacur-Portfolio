import type { Metadata } from "next";
import { WorkScreen } from "@/components/WorkScreen";

export const metadata: Metadata = { title: "Travaux — Pablo Cuerva" };

export default function Page() {
  return <WorkScreen />;
}
