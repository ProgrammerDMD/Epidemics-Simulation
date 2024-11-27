"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { useCircleStore } from "../components/Canvas";
import { Status } from "@/components/Circle";

const Canvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
});

export type SETTINGS = {
  preset: "covid" | "ebola" | "blackplague" | "custom";
  people: number;
  mortality: number;
  minTime: number;
  maxTime: number;
  initialAffected: number;
};

export type EPIDEMICS_PRESETS_TYPE = Record<
  "custom" | "covid" | "ebola" | "blackplague",
  SETTINGS
>;

const EPIDEMICS_PRESETS: EPIDEMICS_PRESETS_TYPE = {
  custom: {
    preset: "custom",
    people: 500,
    mortality: 0.1,
    minTime: 15,
    maxTime: 30,
    initialAffected: 1
  },
  covid: {
    preset: "covid",
    people: 500,
    mortality: 0.1,
    minTime: 5,
    maxTime: 15,
    initialAffected: 10
  },
  ebola: {
    preset: "ebola",
    people: 500,
    mortality: 0.2,
    minTime: 10,
    maxTime: 25,
    initialAffected: 10
  },
  blackplague: {
    preset: "blackplague",
    people: 500,
    mortality: 0.5,
    minTime: 10,
    maxTime: 20,
    initialAffected: 10
  },
};

export default function Home() {
  const { circles, updateCircles } = useCircleStore();
  const [settings, setSettings] = useState<SETTINGS>({
    preset: "custom",
    people: 500,
    mortality: 0.1,
    minTime: 10,
    maxTime: 30,
    initialAffected: 1
  });

  const [started, setStarted] = useState(false);

  return (
    <div>
      <div className="flex p-4 h-[100vh]">
        { /** Prima jumătate */}
        <div className={`flex flex-col gap-4 w-[40vw] h-fit my-auto ${!started && "mx-auto"}`}>
          <div className="text-2xl flex flex-col gap-2 items-center">
            <span>Ce epidemie dorești să simulezi?</span>
            <Select disabled={started} onValueChange={(value) => {
              setSettings((oldValue) => {
                return {
                  preset: value as SETTINGS["preset"],
                  people: oldValue.people,
                  mortality: oldValue.mortality,
                  minTime: oldValue.minTime,
                  maxTime: oldValue.maxTime,
                  initialAffected: oldValue.initialAffected
                }
              })
            }} defaultValue="custom">
              <SelectTrigger className="w-full h-16 text-xl">
                <SelectValue placeholder="Epidemii" />
              </SelectTrigger>
              <SelectContent className="w-full text-xl">
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="covid">COVID-19</SelectItem>
                <SelectItem value="ebola">Ebola</SelectItem>
                <SelectItem value="blackplague">Ciuma Neagră</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(settings.preset === "custom") &&
            <>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este mortalitatea epidemiei?</span>
                <Slider disabled={started} defaultValue={[settings.mortality]} onValueCommit={(value) => {
                  setSettings((oldValue) => {
                    return {
                      preset: oldValue.preset,
                      people: oldValue.people,
                      mortality: value[0],
                      minTime: oldValue.minTime,
                      maxTime: oldValue.maxTime,
                      initialAffected: oldValue.initialAffected
                    }
                  })
                }} min={0} max={1} step={0.01} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Câte persoane contribuie la simulare?</span>
                <Input disabled={started} defaultValue={settings.people} onInput={(value) => {
                  setSettings((oldValue) => {
                    return {
                      preset: oldValue.preset,
                      people: (value.target as HTMLInputElement).valueAsNumber,
                      mortality: oldValue.mortality,
                      minTime: oldValue.minTime,
                      maxTime: oldValue.maxTime,
                      initialAffected: oldValue.initialAffected
                    }
                  })
                }} type="number" placeholder="250" min={0} max={500} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este numărul inițial de persoane afectate?</span>
                <Input disabled={started} defaultValue={settings.initialAffected} onInput={(value) => {
                  setSettings((oldValue) => {
                    return {
                      preset: oldValue.preset,
                      people: oldValue.people,
                      mortality: oldValue.mortality,
                      minTime: oldValue.minTime,
                      maxTime: oldValue.maxTime,
                      initialAffected: (value.target as HTMLInputElement).valueAsNumber
                    }
                  })
                }} type="number" placeholder="50" min={0} max={500} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este timpul minim pentru clasificarea de "Vindecat"? (În secunde)</span>
                <Input disabled={started} defaultValue={settings.minTime} onInput={(value) => {
                  setSettings((oldValue) => {
                    return {
                      preset: oldValue.preset,
                      people: oldValue.people,
                      mortality: oldValue.mortality,
                      minTime: (value.target as HTMLInputElement).valueAsNumber,
                      maxTime: oldValue.maxTime,
                      initialAffected: oldValue.initialAffected
                    }
                  })
                }} type="number" placeholder="30" min={0} max={60} />
              </div>
              <div className="text-2xl flex flex-col gap-2">
                <span>Care este timpul maxim pentru clasificarea de "Vindecat"? (În secunde)</span>
                <Input disabled={started} defaultValue={settings.maxTime} onInput={(value) => {
                  setSettings((oldValue) => {
                    return {
                      preset: oldValue.preset,
                      people: oldValue.people,
                      mortality: oldValue.mortality,
                      minTime: oldValue.minTime,
                      maxTime: (value.target as HTMLInputElement).valueAsNumber,
                      initialAffected: oldValue.initialAffected
                    }
                  })
                }} type="number" placeholder="10" min={0} max={60} />
              </div>
            </>
          }
          <Button className="text-3xl h-14" onClick={() => setStarted(!started)}>{started ? "Oprește simularea" : "Începe simularea"}</Button>
        </div>

        { /** A doua jumătate */}
        {started &&
          <div className="flex flex-col gap-4 w-fit h-fit justify-center bg-primary p-4 mx-auto my-auto rounded-xl items-center">
            <PieChart
              sx={{
                ".MuiPieArc-root": {
                  stroke: "none",
                }
              }}
              series={[
                {
                  arcLabel: (item) => `${item.value}`,
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
            <Canvas
              settings={
                settings.preset === "custom" ? settings : EPIDEMICS_PRESETS[settings.preset]
              }
              width={800}
              height={500}
            />
          </div>
        }
      </div>
    </div>
  );
}
