import { cn } from "@/lib/utils";

const PROGRESS_MIN = 0;
const PROGRESS_MAX = 100;

type ProgressLoaderProps = {
  progress: number;
  className?: string;
  sizeClassName?: string;
  showPercentageLabel?: boolean;
  labelClassName?: string;
  viewBoxSize?: number;
  radius?: number;
  strokeWidth?: number;
  trackColor?: string;
  activeColor?: string;
};

export function ProgressLoader({
  progress,
  className,
  sizeClassName = "size-16",
  showPercentageLabel = false,
  labelClassName,
  viewBoxSize = 68,
  radius = 27,
  strokeWidth = 4,
  trackColor = "currentColor",
  activeColor = "currentColor",
}: ProgressLoaderProps) {
  const normalizedProgress = Math.max(PROGRESS_MIN, Math.min(progress, PROGRESS_MAX));
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalizedProgress / PROGRESS_MAX);

  return (
    <div
      role="progressbar"
      aria-valuemin={PROGRESS_MIN}
      aria-valuemax={PROGRESS_MAX}
      aria-valuenow={Math.round(normalizedProgress)}
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={cn("-rotate-90", sizeClassName)} aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {showPercentageLabel ? (
        <span className={cn("absolute", labelClassName)}>{Math.round(normalizedProgress)}%</span>
      ) : null}
    </div>
  );
}
