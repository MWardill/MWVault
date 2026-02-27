import Image from 'next/image';

interface SpriteProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    unoptimized?: boolean;
}

export default function Sprite({
    src,
    alt,
    width = 64,
    height = 64,
    className = '',
    unoptimized = true
}: SpriteProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized={unoptimized}
            className={className}
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
