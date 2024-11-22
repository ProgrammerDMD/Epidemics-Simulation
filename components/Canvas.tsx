import { useEffect, useState } from 'react';
import { Stage, Layer, Circle as KonvaCircle } from 'react-konva';

export interface Circle {
  x: number;
  y: number;
  angle: number;
}

function angleToVelocity(angle: number, speed: number) {
  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);
  return { vx, vy };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Canvas() {
  const circleRadius = 12.5;
  const speed = 10;

  const circlesImplicit: Circle[] = [];
  for (let i = 0; i < 100; i++) {
    circlesImplicit.push({
      x: Math.random() * (window.innerWidth - 2 * circleRadius) + circleRadius,
      y: Math.random() * (window.innerHeight - 2 * circleRadius) + circleRadius,
      angle: Math.random() * 360
    });
  }

  const [circles, setCircles] = useState<Circle[]>(circlesImplicit);

  useEffect(() => {
    let isMounted = true;

    async function moveCircles() {
      while (isMounted) {
        setCircles(prevCircles => {
          return prevCircles.map(circle => {
            const { vx, vy } = angleToVelocity(circle.angle, speed);
            let nextX = circle.x + vx;
            let nextY = circle.y + vy;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newAngle = circle.angle;

            if (nextX - circleRadius < 0) {
              nextX = circleRadius;
              newAngle = 180 - newAngle;
            } else if (nextX + circleRadius > screenWidth) {
              nextX = screenWidth - circleRadius;
              newAngle = 180 - newAngle;
            }

            if (nextY - circleRadius < 0) {
              nextY = circleRadius;
              newAngle = 360 - newAngle;
            } else if (nextY + circleRadius > screenHeight) {
              nextY = screenHeight - circleRadius;
              newAngle = 360 - newAngle;
            }

            return { x: nextX, y: nextY, angle: newAngle };
          });
        });

        await sleep(33.3);
      }
    }

    moveCircles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {circles.map((circle, index) => (
          <KonvaCircle
            key={index}
            x={circle.x}
            y={circle.y}
            radius={circleRadius}
            fill={"black"}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default Canvas;
