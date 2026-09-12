"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "AmeekAI",
    link: "https://github.com/realsameek-collab/ameek-ai",
    thumbnail: "/ameek-ai-card.svg",
    objectPosition: "center",
  },
];
