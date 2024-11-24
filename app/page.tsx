"use client";

import { useCircleStore } from "@/components/Canvas";
import { Status } from "@/components/Circle";
import { BarChart, PieChart } from "@mui/x-charts";
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});

export default function Home() {
  const { circles, updateCircles } = useCircleStore();

  return (
    <div className="bg-black">
      <PieChart
        sx={{
          ".MuiPieArc-root": {
            stroke: "none",
          }
        }}
        series={[
          {
            data: [
              {
                id: 0,
                value: circles.filter((value) => {
                  return value.status == Status.SUSCEPTIBLE
                }).length,
                label: "Susceptibili",
                color: "white"
              },

              {
                id: 1,
                value: circles.filter((value) => {
                  return value.status == Status.INFECTED
                }).length,
                label: 'Infectați',
                color: "red"
              },

              {
                id: 2,
                value: circles.filter((value) => {
                  return value.status == Status.RECOVERED
                }).length,
                label: "Vindecați",
                color: "green"
              },

              {
                id: 3,
                value: circles.filter((value) => {
                  return value.status == Status.DEAD
                }).length,
                label: "Decedați",
                color: "blue"
              },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 2,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360
          }
        ]}
        slotProps={{
          legend: {
            direction: "column",
            position: {
              vertical: 'middle',
              horizontal: 'right',
            },
            labelStyle: {
              fill: "white"
            },
            itemMarkWidth: 12,
            itemMarkHeight: 2,
            markGap: 6,
            itemGap: 9,
          }
        }}
        width={400}
        height={200}
      />
      <Canvas />
    </div>
  );
}