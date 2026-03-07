import { ArrowLeft, Eye, EyeOff, Loader2, User, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import MainPict from "/assets/main.png";
import type { backendInterface } from "../backend";
import type { FamilySession } from "../types";
import { LogoIcon } from "./Icons";

type OnboardingMode = "select" | "make-family" | "join-family" | "member-name";
type FlowType = "make" | "join";

interface OnboardingProps {
  onSingleList: () => void;
  onFamilyJoined: (session: FamilySession) => void;
  actor: backendInterface | null;
}

const variants = {
  enter: { opacity: 0, x: 24, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -24, scale: 0.98 },
};

export const Onboarding = ({
  onSingleList,
  onFamilyJoined,
  actor,
}: OnboardingProps) => {
  const [mode, setMode] = useState<OnboardingMode>("select");
  const [flowType, setFlowType] = useState<FlowType>("make");
  const [familyName, setFamilyName] = useState("");
  const [password, setPassword] = useState("");
  const [memberName, setMemberName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const familyNameRef = useRef<HTMLInputElement>(null);
  const memberNameRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    setError(null);
    setMode("select");
    setFamilyName("");
    setPassword("");
    setMemberName("");
  };

  const handleMakeFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !familyName.trim() || !password.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await actor.createFamily(familyName.trim(), password);
      if (result.__kind__ === "err") {
        setError(result.err);
        return;
      }
      setMode("member-name");
      setTimeout(() => memberNameRef.current?.focus(), 50);
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !familyName.trim() || !password.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await actor.joinFamily(familyName.trim(), password);
      if (result.__kind__ === "err") {
        setError(result.err);
        return;
      }
      setMode("member-name");
      setTimeout(() => memberNameRef.current?.focus(), 50);
    } catch (_err) {
      setError("Incorrect family name or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !memberName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      if (flowType === "make") {
        await actor.initFamilyCatalog(familyName.trim());
      }
      onFamilyJoined({
        familyName: familyName.trim(),
        memberName: memberName.trim(),
      });
    } catch (_err) {
      setError(
        "Something went wrong setting up your family list. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between gap-4 px-2 pb-4">
      <div className="flex flex-col items-center gap-1 pt-2">
        <LogoIcon className="w-[200px]" />
        <p className="text-[#7C7D7D] text-[15px] leading-snug">
          skoobi doobie doo
        </p>
      </div>

      <div className="w-full max-w-[400px] flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full flex flex-col gap-3"
            >
              <h2 className="text-center text-[22px] font-bold text-[#3B3B3A] mb-1">
                How would you like to shop?
              </h2>

              {/* Make a Family */}
              <button
                type="button"
                data-ocid="onboarding.make_family_button"
                onClick={() => {
                  setFlowType("make");
                  setError(null);
                  setMode("make-family");
                  setTimeout(() => familyNameRef.current?.focus(), 50);
                }}
                className="group relative w-full rounded-[18px] bg-white border-2 border-[#EAE9E8] hover:border-[#BD7760] hover:shadow-md transition-all duration-200 p-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#FDF3EF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F5DDD4] transition-colors duration-200">
                    <Users className="w-6 h-6 text-[#BD7760]" />
                  </div>
                  <div>
                    <p className="font-bold text-[16px] text-[#3B3B3A]">
                      Make a Family
                    </p>
                    <p className="text-[13px] text-[#7C7D7D] leading-snug mt-0.5">
                      Create a shared list for your household
                    </p>
                  </div>
                </div>
              </button>

              {/* Join a Family */}
              <button
                type="button"
                data-ocid="onboarding.join_family_button"
                onClick={() => {
                  setFlowType("join");
                  setError(null);
                  setMode("join-family");
                  setTimeout(() => familyNameRef.current?.focus(), 50);
                }}
                className="group relative w-full rounded-[18px] bg-white border-2 border-[#EAE9E8] hover:border-[#BD7760] hover:shadow-md transition-all duration-200 p-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#FDF3EF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F5DDD4] transition-colors duration-200">
                    <Users className="w-6 h-6 text-[#7B9E8A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[16px] text-[#3B3B3A]">
                      Join a Family
                    </p>
                    <p className="text-[13px] text-[#7C7D7D] leading-snug mt-0.5">
                      Join an existing family list with a password
                    </p>
                  </div>
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#EAE9E8]" />
                <span className="text-[12px] text-[#C1C3CA]">or</span>
                <div className="flex-1 h-px bg-[#EAE9E8]" />
              </div>

              {/* Single List */}
              <button
                type="button"
                data-ocid="onboarding.single_list_button"
                onClick={onSingleList}
                className="group w-full rounded-[18px] bg-[#FAFAF9] border-2 border-[#EAE9E8] hover:border-[#C1C3CA] hover:shadow-sm transition-all duration-200 p-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#F5F5F4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#EEEEEC] transition-colors duration-200">
                    <User className="w-6 h-6 text-[#7C7D7D]" />
                  </div>
                  <div>
                    <p className="font-bold text-[16px] text-[#3B3B3A]">
                      Single List
                    </p>
                    <p className="text-[13px] text-[#7C7D7D] leading-snug mt-0.5">
                      Just for you, stored on your device
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {mode === "make-family" && (
            <motion.div
              key="make-family"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full"
            >
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-[#7C7D7D] hover:text-[#3B3B3A] text-[14px] mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="bg-white rounded-[20px] border-2 border-[#EAE9E8] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FDF3EF] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#BD7760]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-[#3B3B3A]">
                      Create a Family
                    </h3>
                    <p className="text-[12px] text-[#7C7D7D]">
                      Set up your shared shopping space
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleMakeFamily}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="make-family-name"
                      className="text-[13px] font-bold text-[#3B3B3A]"
                    >
                      Family Name
                    </label>
                    <input
                      id="make-family-name"
                      ref={familyNameRef}
                      data-ocid="onboarding.family_name_input"
                      type="text"
                      value={familyName}
                      onChange={(e) => {
                        setFamilyName(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. The Smiths"
                      className="w-full rounded-[12px] border-2 border-[#EAE9E8] bg-[#FAFAF9] px-4 py-3 text-[15px] text-[#3B3B3A] placeholder-[#C1C3CA] focus:outline-none focus:border-[#BD7760] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="make-family-password"
                      className="text-[13px] font-bold text-[#3B3B3A]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="make-family-password"
                        data-ocid="onboarding.family_password_input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="Choose a password"
                        className="w-full rounded-[12px] border-2 border-[#EAE9E8] bg-[#FAFAF9] px-4 py-3 pr-12 text-[15px] text-[#3B3B3A] placeholder-[#C1C3CA] focus:outline-none focus:border-[#BD7760] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C1C3CA] hover:text-[#7C7D7D] transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        data-ocid="onboarding.error_state"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-[10px] border border-red-100"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    data-ocid="onboarding.create_family_button"
                    type="submit"
                    disabled={
                      isLoading || !familyName.trim() || !password.trim()
                    }
                    className="w-full rounded-[12px] bg-[#BD7760] text-white font-bold py-3 text-[15px] disabled:opacity-50 hover:bg-[#A8664F] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                      </>
                    ) : (
                      "Create Family"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {mode === "join-family" && (
            <motion.div
              key="join-family"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full"
            >
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-[#7C7D7D] hover:text-[#3B3B3A] text-[14px] mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="bg-white rounded-[20px] border-2 border-[#EAE9E8] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-[10px] bg-[#EEF4F0] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#7B9E8A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-[#3B3B3A]">
                      Join a Family
                    </h3>
                    <p className="text-[12px] text-[#7C7D7D]">
                      Enter your family's details to join
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleJoinFamily}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="join-family-name"
                      className="text-[13px] font-bold text-[#3B3B3A]"
                    >
                      Family Name
                    </label>
                    <input
                      id="join-family-name"
                      ref={familyNameRef}
                      data-ocid="onboarding.join_family_name_input"
                      type="text"
                      value={familyName}
                      onChange={(e) => {
                        setFamilyName(e.target.value);
                        setError(null);
                      }}
                      placeholder="Enter the family name"
                      className="w-full rounded-[12px] border-2 border-[#EAE9E8] bg-[#FAFAF9] px-4 py-3 text-[15px] text-[#3B3B3A] placeholder-[#C1C3CA] focus:outline-none focus:border-[#7B9E8A] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="join-family-password"
                      className="text-[13px] font-bold text-[#3B3B3A]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="join-family-password"
                        data-ocid="onboarding.join_family_password_input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="Enter the family password"
                        className="w-full rounded-[12px] border-2 border-[#EAE9E8] bg-[#FAFAF9] px-4 py-3 pr-12 text-[15px] text-[#3B3B3A] placeholder-[#C1C3CA] focus:outline-none focus:border-[#7B9E8A] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C1C3CA] hover:text-[#7C7D7D] transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        data-ocid="onboarding.error_state"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-[10px] border border-red-100"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    data-ocid="onboarding.join_family_button_submit"
                    type="submit"
                    disabled={
                      isLoading || !familyName.trim() || !password.trim()
                    }
                    className="w-full rounded-[12px] bg-[#7B9E8A] text-white font-bold py-3 text-[15px] disabled:opacity-50 hover:bg-[#698B78] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Joining…
                      </>
                    ) : (
                      "Join Family"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {mode === "member-name" && (
            <motion.div
              key="member-name"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="bg-white rounded-[20px] border-2 border-[#EAE9E8] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FDF3EF] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#BD7760]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-[#3B3B3A]">
                      What's your name?
                    </h3>
                    <p className="text-[12px] text-[#7C7D7D]">
                      {flowType === "make"
                        ? `You've created "${familyName}"`
                        : `You've joined "${familyName}"`}
                    </p>
                  </div>
                </div>

                <p className="text-[13px] text-[#7C7D7D] mb-5">
                  This name will be visible to family members on the shared
                  list.
                </p>

                <form
                  onSubmit={handleConfirmName}
                  className="flex flex-col gap-4"
                >
                  <label htmlFor="member-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="member-name"
                    ref={memberNameRef}
                    data-ocid="onboarding.member_name_input"
                    type="text"
                    value={memberName}
                    onChange={(e) => {
                      setMemberName(e.target.value);
                      setError(null);
                    }}
                    placeholder="Your name (e.g. Mom, Dad, Alex)"
                    className="w-full rounded-[12px] border-2 border-[#EAE9E8] bg-[#FAFAF9] px-4 py-3 text-[15px] text-[#3B3B3A] placeholder-[#C1C3CA] focus:outline-none focus:border-[#BD7760] transition-colors"
                  />

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        data-ocid="onboarding.error_state"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-[10px] border border-red-100"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    data-ocid="onboarding.confirm_name_button"
                    type="submit"
                    disabled={isLoading || !memberName.trim()}
                    className="w-full rounded-[12px] bg-[#BD7760] text-white font-bold py-3 text-[15px] disabled:opacity-50 hover:bg-[#A8664F] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Setting up…
                      </>
                    ) : (
                      "Let's Shop! 🛒"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <img
        className="max-w-[200px] w-[28vh] opacity-70 pointer-events-none select-none"
        src={MainPict}
        alt="Buyo"
      />
    </div>
  );
};
