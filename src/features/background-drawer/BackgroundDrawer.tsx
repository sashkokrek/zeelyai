import { useId, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/Drawer";
import { ProgressLoader } from "@/components/ui/ProgressLoader";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useMockBackgroundGeneration } from "@/features/background-drawer/useMockBackgroundGeneration";
import { defaultBackgroundDrawerPrompt } from "@/features/background-drawer/backgroundDrawer.data";
import type { BackgroundItem, GenerateBackgroundPayload } from "@/features/background-drawer/types";

export type { BackgroundItem, GenerateBackgroundPayload } from "@/features/background-drawer/types";

const assetSrc = {
  regenerate: "/assets/sidebar/regenerate-icon.svg",
  arrow: "/assets/sidebar/action-button.svg",
  generate: "/assets/sidebar/generate-icon.svg",
  close: "/assets/sidebar/close-icon.svg",
} as const;

const loadingImageVariants = cva("block transition-opacity duration-200", {
  variants: {
    loaded: {
      true: "opacity-100",
      false: "opacity-0",
    },
  },
});

const backgroundPreviewCardVariants = cva(
  "relative aspect-[112/198] w-full max-w-[var(--drawer-preview-width)] overflow-hidden bg-transparent transition-shadow duration-300 ease-out hover:shadow-[0_14px_18px_-10px_rgba(15,23,42,0.46)]",
  {
    variants: {
      selected: {
        true: "rounded-[16px]",
        false: "rounded-[12px]",
      },
    },
  },
);

const focusVisibleClassName = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-1";

const previewImageClassName = "size-full object-cover";
const foregroundOverlayClassName = "pointer-events-none absolute left-px top-px h-[calc(100%-1px)] w-[calc(100%-8px)] overflow-hidden";
const foregroundImageClassName = "h-full w-[106.55%] max-w-none object-cover object-left-top";

function formatGenerationCountdownLabel(secondsLeft: number) {
  return secondsLeft === 1 ? "1 second left" : `${secondsLeft} seconds left`;
}

function LoadingImage({
  src,
  alt,
  containerClassName,
  imageClassName,
  skeletonClassName,
}: {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  return (
    <div className={cn("relative", containerClassName)}>
      {!isLoaded ? (
        <div aria-hidden="true" className={cn("absolute inset-0 animate-pulse bg-zinc-200", skeletonClassName)} />
      ) : null}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={cn(loadingImageVariants({ loaded: isLoaded }), imageClassName)}
        loading="lazy"
      />
    </div>
  );
}

function AssetIcon({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={cn("shrink-0", className)} />;
}


function DrawerActionIconButton({
  src,
  alt,
  direction = "previous",
  onClick,
}: {
  src: string;
  alt: string;
  direction?: "previous" | "next";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-white transition-colors hover:bg-zinc-100", focusVisibleClassName)}
      aria-label={alt}
    >
      <AssetIcon src={src} alt="" className={cn("size-5", direction === "next" && "-scale-x-100")} />
    </button>
  );
}

function BackgroundPreviewLabel({ label }: { label: string }) {
  return (
    <span className="absolute left-2 top-2 inline-flex h-[19px] items-center rounded-[5px] border border-black/[0.05] bg-white px-[4px] backdrop-blur-[7.5px]">
      <span className="relative translate-y-px whitespace-nowrap text-[10px] font-bold uppercase leading-none text-[#404040]">
        {label}
      </span>
    </span>
  );
}

function BackgroundPreviewCard({
  item,
  selected,
  onClick,
}: {
  item: BackgroundItem;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={item.label ? `Select ${item.label} background` : `Select ${item.alt}`}
      className={backgroundPreviewCardVariants({ selected })}
    >
      <LoadingImage
        src={item.imageSrc}
        alt={item.alt}
        containerClassName="absolute inset-0"
        imageClassName={cn(previewImageClassName, item.imageClassName)}
        skeletonClassName="bg-zinc-200"
      />
      {item.foregroundImageSrc && (
        <LoadingImage
          src={item.foregroundImageSrc}
          alt=""
          containerClassName={foregroundOverlayClassName}
          imageClassName={foregroundImageClassName}
          skeletonClassName="bg-transparent"
        />
      )}
      {selected && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[16px] border-2 border-black"
        />
      )}
      {item.label && <BackgroundPreviewLabel label={item.label} />}
    </button>
  );
}

function GeneratingBackgroundCard({
  imageSrc,
  alt,
  imageClassName,
  foregroundImageSrc,
  progress,
  secondsLeft,
}: {
  imageSrc: string;
  alt: string;
  imageClassName?: string;
  foregroundImageSrc?: string;
  progress: number;
  secondsLeft: number;
}) {
  const countdownLabel = formatGenerationCountdownLabel(secondsLeft);

  return (
    <div className="relative aspect-[112/198] w-full max-w-[var(--drawer-preview-width)] overflow-hidden rounded-2xl">
      <LoadingImage
        src={imageSrc}
        alt={alt}
        containerClassName="absolute inset-0"
        imageClassName={cn(previewImageClassName, imageClassName)}
        skeletonClassName="bg-zinc-800"
      />
      {foregroundImageSrc && (
        <LoadingImage
          src={foregroundImageSrc}
          alt=""
          containerClassName={foregroundOverlayClassName}
          imageClassName={foregroundImageClassName}
          skeletonClassName="bg-transparent"
        />
      )}
      <div className="absolute inset-0 bg-[var(--drawer-loading-overlay-scrim)]" />

      <div className="absolute inset-0 flex flex-col items-center px-[var(--drawer-loading-overlay-padding-x)] pb-[var(--drawer-loading-overlay-padding-bottom)] pt-[var(--drawer-loading-overlay-padding-top)] text-white">
        <ProgressLoader
          progress={progress}
          sizeClassName="size-[var(--drawer-progress-size)]"
          trackColor="var(--drawer-progress-track)"
          activeColor="var(--drawer-progress-active)"
          showPercentageLabel
          labelClassName="text-sm font-medium leading-none text-white"
        />

        <span className="mt-auto text-center text-xs font-semibold leading-[1.2] text-white">{countdownLabel}</span>
      </div>
    </div>
  );
}

type BackgroundDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backgrounds: BackgroundItem[];
  title?: string;
  backgroundIdeaLabel?: string;
  initialSelectedBackgroundId?: string;
  onSelectBackground?: (item: BackgroundItem) => void;
  onGenerate?: (payload: GenerateBackgroundPayload) => void;
  onRegenerate?: (prompt: string) => void;
  onPreviousIdea?: () => void;
  onNextIdea?: () => void;
};

export function BackgroundDrawer({
  open,
  onOpenChange,
  backgrounds,
  title = "Change background",
  backgroundIdeaLabel = "Background idea",
  initialSelectedBackgroundId,
  onSelectBackground,
  onGenerate,
  onRegenerate,
  onPreviousIdea,
  onNextIdea,
}: BackgroundDrawerProps) {
  const textareaId = useId();
  const [prompt, setPrompt] = useState(defaultBackgroundDrawerPrompt);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | undefined>(
    initialSelectedBackgroundId ?? backgrounds[0]?.id,
  );

  const { generatedBackgrounds, pendingBackground, generationProgress, secondsLeft, isGenerating, startGeneration } =
    useMockBackgroundGeneration({
      backgrounds,
      prompt,
      selectedBackgroundId,
      onGenerate,
      onComplete: (nextBackground) => {
        setSelectedBackgroundId(nextBackground.id);
        onSelectBackground?.(nextBackground);
      },
    });

  const availableBackgrounds = [...generatedBackgrounds, ...backgrounds];
  const canGenerate = availableBackgrounds.length > 0 && !isGenerating;

  const handleSelectBackground = (item: BackgroundItem) => {
    setSelectedBackgroundId(item.id);
    onSelectBackground?.(item);
  };

  return (
    <Drawer direction="right" shouldScaleBackground={false} open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-zinc-200 bg-white p-0 max-w-[var(--drawer-panel-width)]">
        <div className="flex h-full flex-col bg-white">
          <DrawerHeader className="flex-row items-start gap-3 space-y-0 px-5 pb-0 pt-8 text-left">
            <div className="min-w-0 flex-1">
              <DrawerTitle className="text-[22px] font-bold leading-[1.2] tracking-normal text-black">
                {title}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Generate or select a background for your product
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                className={cn("flex size-6 items-center justify-center rounded-md transition-opacity hover:opacity-70", focusVisibleClassName)}
                aria-label="Close drawer"
              >
                <AssetIcon src={assetSrc.close} alt="" className="size-6" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <ScrollArea type="always" className="mt-6 flex-1 px-5">
            <div className="space-y-10 pb-8">
              <section>
                <label htmlFor={textareaId} className="block text-[14px] font-semibold leading-[1.2] text-black">
                  {backgroundIdeaLabel}
                </label>

                <Card className="relative mt-3 overflow-hidden rounded-xl border-[#f2f4f6] bg-white shadow-none transition-colors focus-within:border-[hsl(var(--ring))]">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Textarea
                        id={textareaId}
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        className="h-[132px] min-h-[132px] resize-none overflow-y-auto rounded-none border-0 bg-white px-4 py-4 text-[14px] font-medium leading-[1.4] text-black shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                      />

                      <div className="flex items-center justify-between rounded-b-xl bg-gradient-to-t from-white from-[69.841%] to-transparent pb-[9px] pl-[9px] pr-4 pt-5">
                        <button
                          type="button"
                          onClick={() => onRegenerate?.(prompt)}
                          className={cn("flex h-[34px] items-center gap-1 rounded-[10px] px-[7px] pr-3 text-[12px] font-semibold leading-[1.2] text-black transition-colors hover:bg-zinc-50", focusVisibleClassName)}
                        >
                          <AssetIcon src={assetSrc.regenerate} alt="" className="size-[18px]" />
                          Regenerate
                        </button>

                        <div className="flex items-center gap-2 pl-2">
                          <DrawerActionIconButton
                            src={assetSrc.arrow}
                            alt="Previous idea"
                            direction="previous"
                            onClick={onPreviousIdea}
                          />
                          <DrawerActionIconButton
                            src={assetSrc.arrow}
                            alt="Next idea"
                            direction="next"
                            onClick={onNextIdea}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="mt-6 h-12 w-full rounded-full bg-black px-7 text-[14px] font-semibold text-white shadow-none hover:bg-black/90"
                  onClick={startGeneration}
                  disabled={!canGenerate}
                >
                  <AssetIcon src={assetSrc.generate} alt="" className="size-4" />
                  <span className="leading-[0.8]">
                    {isGenerating ? "Generating background..." : "Generate BG for 1 credit"}
                  </span>
                </Button>
              </section>

              <section>
                <h3 className="text-[14px] font-semibold leading-[1.2] text-black">Your backgrounds</h3>

                <div className="mt-2.5 grid grid-cols-2 justify-items-center gap-3 min-[400px]:grid-cols-3">
                  {pendingBackground && (
                    <GeneratingBackgroundCard
                      imageSrc={pendingBackground.imageSrc}
                      alt={pendingBackground.alt}
                      imageClassName={pendingBackground.imageClassName}
                      foregroundImageSrc={pendingBackground.foregroundImageSrc}
                      progress={generationProgress}
                      secondsLeft={secondsLeft}
                    />
                  )}

                  {availableBackgrounds.map((item) => (
                    <BackgroundPreviewCard
                      key={item.id}
                      item={item}
                      selected={item.id === selectedBackgroundId}
                      onClick={() => handleSelectBackground(item)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
