import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  blurDataURL?: string
  className?: string
  containerClassName?: string
}

/**
 * OptimizedImage component with WebP support, blur placeholder, and loading states
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/optimized/Drefan.webp"
 *   alt="Drefan Mardiawan"
 *   width={400}
 *   height={600}
 *   blurDataURL={blurPlaceholder}
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  blurDataURL,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Auto-detect if source is WebP
  const isWebP = src.endsWith('.webp')

  // Generate fallback path (replace .webp with .jpg or .png)
  const fallbackSrc = isWebP
    ? src.replace('.webp', '.jpg')
    : src

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-dark-secondary rounded-lg',
          containerClassName
        )}
        style={{
          width: props.width,
          height: props.height,
        }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        {...props}
        src={src}
        alt={alt}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        className={cn(
          'transition-all duration-300',
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0',
          className
        )}
        quality={85}
      />

      {/* Loading skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-tertiary animate-pulse" />
      )}
    </div>
  )
}

/**
 * Responsive optimized image with srcset for different screen sizes
 */
export function ResponsiveOptimizedImage({
  src,
  alt,
  sizes,
  blurDataURL,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps & { sizes?: string }) {
  const [isLoading, setIsLoading] = useState(true)

  // Extract base name without extension
  const baseName = src.replace(/\.(webp|jpg|png)$/, '')
  const extension = src.split('.').pop()

  // Generate srcset for responsive images
  const srcSet = `
    ${baseName}-640w.${extension} 640w,
    ${baseName}-750w.${extension} 750w,
    ${baseName}-828w.${extension} 828w,
    ${baseName}-1080w.${extension} 1080w,
    ${baseName}-1200w.${extension} 1200w,
    ${src} ${props.width}w
  `

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <picture>
        <source
          type="image/webp"
          srcSet={srcSet}
          sizes={sizes || '100vw'}
        />
        <Image
          {...props}
          src={src}
          alt={alt}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoading(false)}
          className={cn(
            'transition-all duration-300',
            isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0',
            className
          )}
          quality={85}
        />
      </picture>

      {isLoading && (
        <div className="absolute inset-0 bg-dark-tertiary animate-pulse" />
      )}
    </div>
  )
}
