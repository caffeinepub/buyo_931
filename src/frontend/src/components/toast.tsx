import { useEffect, useState } from "react";

interface ToastProps {
  text: string;
}

export const Toast = ({ text }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        bg-[rgba(108,60,43,0.9)]
        shadow-[0px_2px_10px_rgba(91,95,105,0.4)]
        backdrop-blur-[2.5px]
        rounded-[12px]
        px-4 py-2
        text-white"
    >
      {text}
    </div>
  );
};
