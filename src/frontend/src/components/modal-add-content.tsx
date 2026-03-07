import type { ListItemPaginatedResponse } from "../backend";
import { Input } from "./input";
import { InputDropdown } from "./input-dropdown";

interface ModalAddContentProps {
  setValue: (v: string) => void;
  value: string;
  setAmount: (v?: number) => void;
  amount?: number;
  error: boolean;
  items?: ListItemPaginatedResponse;
  title?: string;
}

export const ModalAddContent = ({
  value,
  setValue,
  amount,
  setAmount,
  error,
  items,
  title,
}: ModalAddContentProps) => {
  if (!title) return null;

  return (
    <>
      <h2 className="text-[20px] font-bold mb-4 truncate whitespace-nowrap overflow-hidden">
        {title}
      </h2>
      <InputDropdown
        setValue={setValue}
        value={value}
        error={error}
        items={items}
      />
      <Input
        value={amount?.toString() || ""}
        placeholder="Amount"
        id="amount"
        label="Amount"
        className="mt-4"
        onChange={(e) => {
          const val = e.target.value;

          if (val === "") {
            setAmount(undefined);
            return;
          }

          if (/^\d*$/.test(val)) {
            setAmount(Number(val));
          }
        }}
      />
    </>
  );
};
