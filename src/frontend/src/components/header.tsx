import { BackIcon, LogoIcon } from "./Icons";

export interface HeaderButton {
  icon: React.ComponentType<{ className?: string }> | null;
  action: () => void;
  id?: string;
}

export interface HeaderProps {
  text: string | null;
  hasBackBtn: boolean;
  buttons?: HeaderButton[];
  backhandler: () => void;
  buttonBlurred: boolean;
  subtitle?: string;
}

export const Header = ({
  text,
  hasBackBtn,
  buttons = [],
  backhandler,
  buttonBlurred,
  subtitle,
}: HeaderProps) => {
  return (
    <div className="mb-[24px] sm:mb-[10px] flex justify-between items-center gap-[10px]">
      {hasBackBtn && (
        <button
          type="button"
          className="min-w-10 w-10 h-10 rounded-[12px] bg-white flex items-center justify-center cursor-pointer"
          onClick={backhandler}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      )}
      <div className="mr-auto min-w-0 flex flex-col justify-center">
        <h2 className="text-[26px] leading-10 font-bold truncate whitespace-nowrap overflow-hidden">
          {text !== null ? (
            text
          ) : (
            <LogoIcon className="w-[108px] relative z-[4]" />
          )}
        </h2>
        {subtitle && (
          <p className="text-[12px] text-[#7C7D7D] leading-none -mt-1 truncate whitespace-nowrap overflow-hidden">
            {subtitle}
          </p>
        )}
      </div>
      {buttons.length > 0 && (
        <div className="flex bg-white rounded-[12px]">
          {buttons.map((btn, index) => (
            <button
              type="button"
              key={btn.id || index}
              className={`relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none ${index > 0 ? "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-[#f0f0f0]" : ""} ${!btn.icon ? "w-[60px]" : "w-10"} ${buttonBlurred ? "z-[-1]" : ""}`}
              onClick={btn.action}
            >
              {!btn.icon ? (
                <span className="font-bold text-[#BD7760]">Done</span>
              ) : (
                <btn.icon />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
