import { ButtonType } from "../types";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitButtontext: string;
  disabled: boolean;
  children: React.ReactNode;
  error?: string;
  isDeletion?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  disabled,
  error,
  submitButtontext,
  children,
  isDeletion,
}) => {
  if (isOpen === false) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px]">
      <div className="border border-white shadow-[0_0_25px_#656A7A] rounded-[22px] p-4 bg-[#F4F3F3] relative w-full max-w-[370px]">
        {children}
        <div className="flex gap-4 mt-[30px]">
          <Button
            btnType={ButtonType.SECONDARY}
            text="Cancel"
            onClick={onClose}
          />
          <Button
            btnType={
              isDeletion === true ? ButtonType.TERTIARY : ButtonType.PRIMARY
            }
            text={submitButtontext}
            onClick={onSubmit}
            disabled={disabled}
          />
          {error != null && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};
