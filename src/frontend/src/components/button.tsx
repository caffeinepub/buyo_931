import React from "react";
import type { ButtonHTMLAttributes, ComponentType } from "react";
import { ButtonType } from "../types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnType: ButtonType;
  text: string;
  icon?: ComponentType<{ className?: string }> | null;
  width?: number;
}

export const Button = ({
  btnType,
  text,
  icon,
  width,
  ...rest
}: ButtonProps) => {
  const classNames =
    btnType === ButtonType.PRIMARY
      ? [
          "[background:linear-gradient(360deg,_#6A3B2C_0%,_#835444_100%)]",
          "[box-shadow:0px_2px_10px_rgba(116,70,54,0.4)]",
          "hover:[background:linear-gradient(360deg,_#76412F_0%,_#955C49_100%)]",
          "active:[background:linear-gradient(360deg,_#6A3B2C_0%,_#6A3B2C_100%)]",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:[background:linear-gradient(360deg,_#6A3B2C_0%,_#835444_100%)] disabled:shadow-none",
        ].join(" ")
      : btnType === ButtonType.SECONDARY
        ? [
            "[background:linear-gradient(0deg,_#1D1F21_0%,_#3D424E_100%)]",
            "[box-shadow:0px_2px_10px_rgba(91,95,105,0.4)]",
            "hover:[background:linear-gradient(0deg,_#373A3F_0%,_#454C5E_100%)]",
            "active:[background:linear-gradient(0deg,_#1D1F21_0%,_#1D1F21_100%)]",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:[background:linear-gradient(0deg,_#1D1F21_0%,_#3D424E_100%)] disabled:shadow-none",
          ].join(" ")
        : [
            "[background:linear-gradient(360deg,_#8C0505_0%,_#B80909_100%)]",
            "[box-shadow:0px_2px_10px_rgba(116,70,54,0.4)]",
            "hover:[background:linear-gradient(360deg,_#A60808_0%,_#CE2936_100%)]",
            "active:[background:linear-gradient(360deg,_#8C0505_0%,_#8C0505_100%)]",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:[background:linear-gradient(360deg,_#8C0505_0%,_#B80909_100%)] disabled:shadow-none",
          ].join(" ");

  // Capitalize the component variable for JSX usage
  const IconComponent = icon;

  return (
    <button
      className={`group flex items-center justify-center gap-1.5 w-full h-[50px] text-white text-[16px] rounded-[12px] transition-all duration-200 ease-in-out ${classNames}`}
      style={{
        textShadow: "0px 1px 3px rgba(65,16,0,0.5)",
        width: `${width}px`,
      }}
      {...rest}
    >
      {IconComponent && <IconComponent />}
      <span className="group-active:opacity-50 group-disabled:opacity-40">
        {text}
      </span>
    </button>
  );
};
