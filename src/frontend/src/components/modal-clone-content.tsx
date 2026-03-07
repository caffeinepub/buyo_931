import { Input } from "./input";

interface ModalCloneContentProps {
  setValue: (v: string) => void;
  value: string;
  error: boolean;
}

export const ModalCloneContent = ({
  value,
  setValue,
  error,
}: ModalCloneContentProps) => {
  return (
    <>
      <h2 className="text-[20px] font-bold mb-4">Clone list</h2>
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
