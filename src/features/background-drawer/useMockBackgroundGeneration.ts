import { useEffect, useRef, useState } from "react";

import type { BackgroundItem, GenerateBackgroundPayload } from "@/features/background-drawer/types";

const mockGenerationDurationMs = 5000;
const mockGenerationStepMs = 100;

function getBackgroundById(items: BackgroundItem[], id: string | undefined) {
  if (id === undefined) {
    return undefined;
  }

  return items.find((item) => item.id === id);
}

function getMockGeneratedBackground(items: BackgroundItem[], selectedId: string | undefined) {
  if (items.length === 0) {
    return undefined;
  }

  if (selectedId === undefined) {
    return items[0];
  }

  const selectedIndex = items.findIndex((item) => item.id === selectedId);

  if (selectedIndex === -1) {
    return items[0];
  }

  return items[(selectedIndex + 1) % items.length];
}

type UseMockBackgroundGenerationParams = {
  backgrounds: BackgroundItem[];
  prompt: string;
  selectedBackgroundId?: string;
  onGenerate?: (payload: GenerateBackgroundPayload) => void;
  onComplete?: (item: BackgroundItem) => void;
};

export function useMockBackgroundGeneration({
  backgrounds,
  prompt,
  selectedBackgroundId,
  onGenerate,
  onComplete,
}: UseMockBackgroundGenerationParams) {
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<BackgroundItem[]>([]);
  const [pendingBackground, setPendingBackground] = useState<BackgroundItem | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(mockGenerationDurationMs / 1000));
  const onCompleteRef = useRef(onComplete);

  const isGenerating = pendingBackground !== null;
  const allBackgrounds = [...generatedBackgrounds, ...backgrounds];
  const selectedBackground = getBackgroundById(allBackgrounds, selectedBackgroundId) ?? allBackgrounds[0];
  const resolvedSelectedBackgroundId = selectedBackground?.id;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (pendingBackground === null) {
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      const nextProgress = Math.min((elapsedMs / mockGenerationDurationMs) * 100, 100);
      const remainingMs = Math.max(mockGenerationDurationMs - elapsedMs, 0);

      setGenerationProgress(nextProgress);
      setSecondsLeft(remainingMs === 0 ? 0 : Math.max(1, Math.ceil(remainingMs / 1000)));

      if (elapsedMs < mockGenerationDurationMs) {
        return;
      }

      window.clearInterval(intervalId);
      setGeneratedBackgrounds((currentItems) => [pendingBackground, ...currentItems]);
      onCompleteRef.current?.(pendingBackground);
      setPendingBackground(null);
    }, mockGenerationStepMs);

    return () => window.clearInterval(intervalId);
  }, [pendingBackground]);

  const startGeneration = () => {
    if (!resolvedSelectedBackgroundId || isGenerating) {
      return;
    }

    onGenerate?.({
      prompt,
      selectedBackgroundId: resolvedSelectedBackgroundId,
      selectedBackground,
    });

    const sourceBackground =
      getMockGeneratedBackground(allBackgrounds, resolvedSelectedBackgroundId) ?? selectedBackground;

    if (!sourceBackground) {
      return;
    }

    setGenerationProgress(0);
    setSecondsLeft(Math.ceil(mockGenerationDurationMs / 1000));
    setPendingBackground({
      id: `generated-${Date.now()}`,
      imageSrc: sourceBackground.imageSrc,
      alt: `Generated version of ${sourceBackground.alt.toLowerCase()}`,
      imageClassName: sourceBackground.imageClassName,
      label: "NEW",
      foregroundImageSrc: sourceBackground.foregroundImageSrc,
    });
  };

  return {
    generatedBackgrounds,
    pendingBackground,
    generationProgress,
    secondsLeft,
    isGenerating,
    startGeneration,
  };
}
