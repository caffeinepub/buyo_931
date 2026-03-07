export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label: string;
  id: string;
  error?: boolean;
  inputClassNames?: string;
}

export const Input = ({
  value,
  id,
  label,
  className,
  error,
  inputClassNames,
  ...rest
}: InputProps) => {
  return (
    <div className={className}>
      <label
        className="font-inter text-[#364252] text-[13px] leading-4"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        name={id}
        id={id}
        value={value}
        className={`
                block w-full mt-1 h-[50px] rounded-[12px] bg-white p-4 outline-none border-[1px]
                transition-colors duration-150 ease-in-out
                ${
                  error === true
                    ? "border-[#DC0F00] [box-shadow:0px_0px_4px_rgba(220,15,0,0.9),_0px_1px_1px_rgba(63,73,80,0.1)]"
                    : "border-white [box-shadow:0px_1px_1px_rgba(63,73,80,0.1)] " +
                      "hover:border-[#835444] hover:[box-shadow:0px_1px_1px_rgba(63,73,80,0.1)] " +
                      "focus:border-[#835444] focus:[box-shadow:0px_0px_4px_rgba(131,84,68,0.9),_0px_1px_1px_rgba(63,73,80,0.1)]"
                }
                ${inputClassNames}
            `}
        {...rest}
      />
    </div>
  );
};
