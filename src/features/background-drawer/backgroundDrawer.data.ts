import type { BackgroundItem } from "@/features/background-drawer/types";

export const defaultBackgroundDrawerPrompt =
  "Animate glowing rays pulsating from behind the bottle, leaves gently swaying, and golden sparkles floating upward for a natural, radiant effect.";

export const defaultBackgroundDrawerItems: BackgroundItem[] = [
  {
    id: "default",
    imageSrc: "/assets/sidebar/background-default.webp",
    alt: "Default background with indoor shelf setting",
    label: "DEFAULT",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.webp",
  },
  {
    id: "soft-room",
    imageSrc: "/assets/sidebar/background-soft-room.webp",
    alt: "Indoor soft room background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.webp",
  },
  {
    id: "garden",
    imageSrc: "/assets/sidebar/background-garden.webp",
    alt: "Garden path background",
    imageClassName: "scale-[1.06]",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.webp",
  },
  {
    id: "stairs",
    imageSrc: "/assets/sidebar/background-stairs.webp",
    alt: "Modern stairway background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.webp",
  },
  {
    id: "court",
    imageSrc: "/assets/sidebar/background-court.webp",
    alt: "Outdoor court background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.webp",
  },
];
