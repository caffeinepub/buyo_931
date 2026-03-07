export const Loader = () => {
  return (
    <div className="fixed w-full h-full flex justify-center items-center inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex gap-1">
        <div className="w-[11px] h-[11px] rounded-full bg-[#FEFEFE] animate-[fade-pulse_1.2s_ease-in-out_0s_infinite]" />
        <div className="w-[11px] h-[11px] rounded-full bg-[#F0F0F0] animate-[fade-pulse_1.2s_ease-in-out_0.2s_infinite]" />
        <div className="w-[11px] h-[11px] rounded-full bg-[#F4F3F3] animate-[fade-pulse_1.2s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
};
