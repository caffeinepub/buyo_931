import { Input } from "./input";

interface ModalCreateContentProps {
  setValue: (v: string) => void;
  value: string;
  error: boolean;
}

export const ModalCreateContent = ({
  value,
  setValue,
  error,
}: ModalCreateContentProps) => {
  return (
    <>
      <h2 className="text-[20px] font-bold mb-4">Create list</h2>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Name"
        id="crete-list"
        label="Name"
        error={error}
      />
      {error && (
        <div className="font-inter text-[13px] mt-1 text-[#DC0F00]">
          List with this name already exist
        </div>
      )}
    </>
  );
};
