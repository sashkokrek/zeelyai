import type { BackgroundItem } from "@/features/background-drawer/types";

export const defaultBackgroundDrawerPrompt =
  "Animate glowing rays pulsating from behind the bottle, leaves gently swaying, and golden sparkles floating upward for a natural, radiant effect.";

export const defaultBackgroundDrawerItems: BackgroundItem[] = [
  {
    id: "default",
    imageSrc: "/assets/sidebar/background-default.png",
    alt: "Default background with indoor shelf setting",
    label: "DEFAULT",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.png",
  },
  {
    id: "soft-room",
    imageSrc: "/assets/sidebar/background-soft-room.png",
    alt: "Indoor soft room background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.png",
  },
  {
    id: "garden",
    imageSrc: "/assets/sidebar/background-garden.png",
    alt: "Garden path background",
    imageClassName: "scale-[1.06]",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.png",
  },
  {
    id: "stairs",
    imageSrc: "/assets/sidebar/background-stairs.png",
    alt: "Modern stairway background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.png",
  },
  {
    id: "court",
    imageSrc: "/assets/sidebar/background-court.png",
    alt: "Outdoor court background",
    foregroundImageSrc: "/assets/sidebar/avatar-foreground.png",
  },
];
