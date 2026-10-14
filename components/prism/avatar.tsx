import type { CSSProperties } from "react";
import type { AnimatedAsset } from "@/lib/discord";
import { StatusDot } from "./presence";

/** An animated Discord asset that falls back to its still frame under reduced motion. */
export function AnimatedImg({
  asset,
  alt,
  className,
  wrapperClassName,
}: {
  asset: AnimatedAsset;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}) {
  return (
    <picture className={wrapperClassName}>
      {asset.src !== asset.still && <source srcSet={asset.still} media="(prefers-reduced-motion: reduce)" />}
      <img src={asset.src} alt={alt} className={className} decoding="async" />
    </picture>
  );
}

/** Avatar with the Discord decoration (drawn 20% larger) and the live status dot. */
export function Avatar({
  avatar,
  decoration,
  alt,
  size = 112,
  className,
}: {
  avatar: AnimatedAsset;
  decoration?: AnimatedAsset;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={className ? `pg-avatar ${className}` : "pg-avatar"} style={{ "--size": `${size}px` } as CSSProperties}>
      <AnimatedImg asset={avatar} alt={alt} className="pg-avatar__img" />
      {decoration && <AnimatedImg asset={decoration} alt="" wrapperClassName="pg-avatar__deco" />}
      <StatusDot />
    </div>
  );
}
