import { useEffect } from "react";
import MainPict from "/assets/main.png";
import { Screen } from "../types";
import { DfinityIcon, LogoIcon } from "./Icons";

export interface StartProps {
  setScreen: (value: Screen) => void;
  isLoading: boolean;
}

export const Start = ({ setScreen, isLoading }: StartProps) => {
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      setScreen(Screen.LIST);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, setScreen]);

  return (
    <div className="h-full flex flex-col justify-between items-center">
      <div className="text-center">
        <LogoIcon className="w-[270px] mb-[17px]" />
        <h2 className="leading-[22px] text-[#7C7D7D] text-[18px]">
          Plan it. Share it. Shop it.
        </h2>
      </div>
      <img className="max-w-[430px] w-[50vh]" src={MainPict} alt="Buyo start" />
      <DfinityIcon className="w-[270px]" />
    </div>
  );
};
