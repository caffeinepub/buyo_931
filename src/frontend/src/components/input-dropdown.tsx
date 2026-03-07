import { useEffect, useRef, useState } from "react";
import type { ListItemPaginatedResponse } from "../backend";
import { ArrowIcon } from "./Icons";
import { Input } from "./input";

export interface InputDropdownProps {
  value: string;
  setValue: (v: string) => void;
  error: boolean;
  items?: ListItemPaginatedResponse;
}

export const InputDropdown = ({
  value,
  setValue,
  error,
  items,
}: InputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        container.current &&
        !container.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clickHandler = (v: string) => {
    setValue(v);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={container}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Item"
        id="add-item"
        label="Item"
        error={error}
        autoComplete="off"
        inputClassNames="pr-[60px]"
        onFocus={() => setIsOpen(true)}
      />
      <div className="absolute w-11 h-10 border-l-[1px] border-[#f0f0f0] right-0 top-[25px] flex justify-center items-center">
        <ArrowIcon
          className={
            isOpen
              ? "rotate-180 transition-transform duration-200 ease-in-out"
              : "transition-transform duration-200 ease-in-out"
          }
        />
      </div>
      <ul
        className={`absolute top-[100%] z-[2] left-0 bg-white w-full rounded-[12px] overflow-hidden [box-shadow:0px_2px_15px_rgba(135,135,135,0.25)] ${isOpen ? "block" : "hidden"}`}
      >
        {items?.items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="w-full px-4 h-[50px] transition-all duration-200 ease-in-out hover:bg-[#F4F3F3] flex items-center cursor-pointer text-left"
              onClick={() => clickHandler(item.name)}
            >
              <span className="truncate whitespace-nowrap overflow-hidden w-full">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <div className="font-inter text-[13px] mt-1 text-[#DC0F00]">
          Already added
        </div>
      )}
    </div>
  );
};
