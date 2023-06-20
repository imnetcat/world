import React, { useEffect, useRef } from 'react';

export interface CanvasProps extends React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
    draw: (context: CanvasRenderingContext2D) => void;
};

export const Canvas = ({ draw, ...props }: CanvasProps): JSX.Element => {
    const canvasRef: React.LegacyRef<HTMLCanvasElement> = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return;
        const context = canvas.getContext('2d')
        if (!context) return;
        draw(context);
    }, [canvasRef, draw]);

    return <canvas ref={canvasRef} {...props} />
}
