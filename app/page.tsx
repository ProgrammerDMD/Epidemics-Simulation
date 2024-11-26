"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCircleStore } from "../components/Canvas";
import { Status } from "@/components/Circle";

const Canvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

export default function Home() {
  const { circles, updateCircles } = useCircleStore();
  const [ preset, setPreset ] = useState<string | undefined>("custom");

  const divRef = useRef<any>();
  const [ dimensions, setDimensions ] = useState({ width:0, height: 0 });

  useLayoutEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight
      });
    }
  }, []);

  return (
    <div>
      <div className="flex p-4">
        { /** Prima jumatate */}
        <div className="flex flex-col gap-4 w-[40vw] h-[100vh] justify-center">
          <div className="text-2xl flex flex-col gap-2 items-center">
            <span>Ce epidemie doresti sa simulezi?</span>
            <Select onValueChange={(value) => { setPreset(value) }} defaultValue="custom">
              <SelectTrigger className="w-full h-16 text-xl">
                <SelectValue placeholder="Epidemii" />
              </SelectTrigger>
              <SelectContent className="w-full text-xl">
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="covid">COVID 19</SelectItem>
                <SelectItem value="dark">Ebola</SelectItem>
                <SelectItem value="system">Black Plague</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(preset === undefined || preset === "custom") &&
            <>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este mortalitatea epidemiei?</span>
                <Slider defaultValue={[5]} max={100} step={0.1} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Cate persoane contribuie la simulare?</span>
                <Input type="number" placeholder="250" min={0} max={500} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este timpul minim pentru clasificarea de "Vindecat"? (In secunde)</span>
                <Input type="number" placeholder="30" min={0} max={60} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este timpul maxim pentru clasificarea de "Vindecat"? (In secunde)</span>
                <Input type="number" placeholder="10" min={0} max={60} />
              </div>
            </>
          }
          <Button className="text-3xl h-14">Incepe simularea</Button>
        </div>

        { /** A doua jumatate */}
        <div ref={divRef} className="flex flex-col gap-4 w-[50vw] h-fit justify-center bg-primary p-4 m-auto rounded-xl items-center">
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
          <Canvas width={dimensions.width > 0 ? dimensions.width - 32 : 800} height={500} />
        </div>
      </div>
    </div>
  );
}