"use client";
import { SETTINGS } from "@/app/page";
import { Circle, CIRCLE_RADIUS, Status } from "@/components/Circle";
import { useEffect } from 'react';
import { Stage, Layer, Circle as KonvaCircle } from 'react-konva';
import { create } from "zustand";

function angleToVelocity(angle: number, speed: number) {
  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);
  return { vx, vy };
}

function getColorByStatus(status: Status): string {
  switch (status) {
    case Status.RECOVERED:
      return "green";
    case Status.INFECTED:
      return "red";
    case Status.SUSCEPTIBLE:
      return "white";
    case Status.DEAD:
      return "blue";
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type CircleStore = {
  circles: Circle[];
  updateCircles: (updater: (circles: Circle[]) => Circle[]) => void;
};

export const useCircleStore = create<CircleStore>((set) => ({
  circles: [],
  updateCircles: (updater) => set((state) => ({ circles: updater(state.circles) })),
}));

function Canvas({ settings, width, height }: {
  settings: SETTINGS,
  width: number,
  height: number
}) {
  const speed = 5;
  const { circles, updateCircles } = useCircleStore();

  useEffect(() => {
    const initialCircles: Circle[] = [];
    var maxTime = settings.maxTime <= 0 ? 30 : settings.maxTime;
    var minTime = settings.minTime <= 0 ? 15 : settings.minTime;
    var interval = (maxTime - minTime) * 30;
    if (interval <= 0) {
      interval = 30 * 30;
    }

    for (let i = 0; i < settings.initialAffected; i++) {
      initialCircles.push(new Circle(
        Math.random() * (width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        Math.random() * (height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        Math.random() * 360,
        Status.INFECTED,
        0,
        Math.floor(Math.random() * interval + minTime)
      ));
    }

    for (let i = 0; i < settings.people - settings.initialAffected; i++) {
      initialCircles.push(new Circle(
        Math.random() * (width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        Math.random() * (height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        Math.random() * 360,
        Status.SUSCEPTIBLE,
        0,
        Math.floor(Math.random() * interval + minTime)
      ));
    }

    useCircleStore.setState({ circles: initialCircles });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const DYING_PROBABILITY_PER_FRAME = 1 - Math.pow(1 - settings.mortality, 1 / 30);

    async function run() {
      while (isMounted) {
        updateCircles(prevCircles => {
          return prevCircles.map(circle => {
            if (circle.status == Status.DEAD) return circle;

            const { vx, vy } = angleToVelocity(circle.angle, speed);
            let nextX = circle.x + vx;
            let nextY = circle.y + vy;

            let newAngle = circle.angle;

            if (nextX - CIRCLE_RADIUS < 0) {
              nextX = CIRCLE_RADIUS;
              newAngle = 180 - newAngle;
            } else if (nextX + CIRCLE_RADIUS > width) {
              nextX = width - CIRCLE_RADIUS;
              newAngle = 180 - newAngle;
            }

            if (nextY - CIRCLE_RADIUS < 0) {
              nextY = CIRCLE_RADIUS;
              newAngle = 360 - newAngle;
            } else if (nextY + CIRCLE_RADIUS > height) {
              nextY = height - CIRCLE_RADIUS;
              newAngle = 360 - newAngle;
            }

            circle.recover();
            circle.kill(DYING_PROBABILITY_PER_FRAME);
            if (!circle.infectable()) return new Circle(nextX, nextY, newAngle, circle.status, circle.recoveryThreshold, circle.maxRecoveryThreshold);
            const isOverlapping = prevCircles.some(otherCircle =>
              circle !== otherCircle && circle.overlaps(otherCircle) && otherCircle.status == Status.INFECTED
            );

            if (isOverlapping) return new Circle(nextX, nextY, newAngle, Status.INFECTED, circle.recoveryThreshold, circle.maxRecoveryThreshold);
            return new Circle(nextX, nextY, newAngle, circle.status, circle.recoveryThreshold, circle.maxRecoveryThreshold);
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
    <Stage width={width} height={height}>
      <Layer>
        {circles.map((circle, index) => (
          <KonvaCircle
            visible={circle.status !== Status.DEAD}
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
