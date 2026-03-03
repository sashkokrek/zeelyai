export type BackgroundItem = {
  id: string;
  imageSrc: string;
  alt: string;
  imageClassName?: string;
  label?: string;
  foregroundImageSrc?: string;
};

export type GenerateBackgroundPayload = {
  prompt: string;
  selectedBackgroundId: string;
  selectedBackground?: BackgroundItem;
};
