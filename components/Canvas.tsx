import { Circle, CIRCLE_RADIUS, Status } from "@/components/Circle";
import { useEffect, useState } from 'react';
import { Stage, Layer, Circle as KonvaCircle } from 'react-konva';

function angleToVelocity(angle: number, speed: number) {
  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);
  return { vx, vy };
}

function getRandomStatus(): Status {
  return Math.floor(Math.random() * 3);
}

function getColorByStatus(status: Status): string {
  switch (status) {
    case Status.RECOVERED:
      return "green";
    case Status.INFECTED:
      return "red";
    case Status.SUSCEPTIBLE:
      return "white"
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Canvas() {
  const speed = 5;
  const circlesImplicit: Circle[] = [];

  for (let i = 0; i < 1; i++) {
    circlesImplicit.push(new Circle(
      Math.random() * (window.innerWidth - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
      Math.random() * (window.innerHeight - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
      Math.random() * 360,
      Status.INFECTED,
      0
    ));
  }

  for (let i = 0; i < 999; i++) {
    circlesImplicit.push(new Circle(
      Math.random() * (window.innerWidth - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
      Math.random() * (window.innerHeight - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
      Math.random() * 360,
      Status.SUSCEPTIBLE,
      0
    ));
  }


  const [circles, setCircles] = useState<Circle[]>(circlesImplicit);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      while (isMounted) {
        setCircles(prevCircles => {
          return prevCircles.map(circle => {
            const { vx, vy } = angleToVelocity(circle.angle, speed);
            let nextX = circle.x + vx;
            let nextY = circle.y + vy;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newAngle = circle.angle;

            if (nextX - CIRCLE_RADIUS < 0) {
              nextX = CIRCLE_RADIUS;
              newAngle = 180 - newAngle;
            } else if (nextX + CIRCLE_RADIUS > screenWidth) {
              nextX = screenWidth - CIRCLE_RADIUS;
              newAngle = 180 - newAngle;
            }

            if (nextY - CIRCLE_RADIUS < 0) {
              nextY = CIRCLE_RADIUS;
              newAngle = 360 - newAngle;
            } else if (nextY + CIRCLE_RADIUS > screenHeight) {
              nextY = screenHeight - CIRCLE_RADIUS;
              newAngle = 360 - newAngle;
            }

            circle.recover();
            if (!circle.infectable()) return new Circle(nextX, nextY, newAngle, circle.status, circle.recoveryThreshold);
            const isOverlapping = prevCircles.find(otherCircle =>
              circle !== otherCircle && circle.overlaps(otherCircle) && otherCircle.status == Status.INFECTED
            );

            if (isOverlapping) return new Circle(nextX, nextY, newAngle, Status.INFECTED, circle.recoveryThreshold);
            return new Circle(nextX, nextY, newAngle, circle.status, circle.recoveryThreshold);
          });
        });

        await sleep(33.3);
      }
    }

    run();

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
            radius={CIRCLE_RADIUS}
            fill={getColorByStatus(circle.status)}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default Canvas;
