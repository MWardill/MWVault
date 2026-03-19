import React from 'react';

interface SpriteSheetIconProps {
    src: string;
    width?: number;
    height?: number;
    sheetWidth?: number;
    sheetHeight?: number;
    x: number; // grid x index
    y: number; // grid y index
    className?: string;
    style?: React.CSSProperties;
}

export default function SpriteSheetIcon({
    src,
    width = 64,
    height = 64,
    sheetWidth = 1024,
    sheetHeight = 1024,
    x,
    y,
    className = '',
    style = {}
}: SpriteSheetIconProps) {
    return (
        <div
            className={`inline-block ${className}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url('${src}')`,
                backgroundPosition: `-${x * width}px -${y * height}px`,
                backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
                imageRendering: 'pixelated',
                backgroundRepeat: 'no-repeat',
                ...style
            }}
            aria-hidden="true"
        />
    );
}
