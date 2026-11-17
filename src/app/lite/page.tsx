import type { Metadata } from "next";
import { LiteSite } from "@/components/lite/LiteSite";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: `2D Archive — ${profile.name} (${profile.handle})`,
  description: `Accessible 2D engineering archive for ${profile.name}: Spotly, FlashPDF, Hacia, wos-util, payment-processor, stm32-utils, and 2023 Android origins.`,
};

export default function LitePage() {
  return <LiteSite />;
}
