const LOCAL_RASTER = /^\/assets\/(?!optimized\/)(.+)\.(?:jpe?g|png)$/i;

export const RESPONSIVE_IMAGE_WIDTHS = [320, 640, 960, 1600] as const;

function localAssetStem(src: string): string | undefined {
  return src.match(LOCAL_RASTER)?.[1];
}

export function optimizedImageSrc(src: string, width?: number): string {
  const stem = localAssetStem(src);
  if (!stem) return src;

  const suffix = width ? `.w${width}` : '';
  return `/assets/optimized/${stem}${suffix}.webp`;
}

export function optimizedImageSrcSet(src: string): string | undefined {
  const stem = localAssetStem(src);
  if (!stem) return undefined;

  return RESPONSIVE_IMAGE_WIDTHS
    .map((width) => `${optimizedImageSrc(src, width === 1600 ? undefined : width)} ${width}w`)
    .join(', ');
}
