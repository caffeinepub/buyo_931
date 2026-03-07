import { useQueryClient } from "@tanstack/react-query";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import EmptyPict from "/assets/sublist-empty.png";
import type {
  ShoppingListItemResponse,
  ShoppingListResponse,
} from "../backend";
import { CheckGrayIcon, CheckIcon, DeleteIcon } from "./Icons";
import { Toast } from "./toast";

interface ListItemProps {
  list: ShoppingListResponse | undefined;
  isEditMode: boolean;
  completeItem: (ids: bigint[]) => void;
  editedItems: ShoppingListItemResponse[];
  setEditedItems: Dispatch<SetStateAction<ShoppingListItemResponse[]>>;
  isCompleted: boolean;
  setIsCompleted: (v: boolean) => void;
  setIsEmpty: (v: boolean) => void;
  refetchLists: () => void;
}

export const Sublist = ({
  list,
  isEditMode,
  completeItem,
  editedItems,
  setEditedItems,
  isCompleted,
  setIsCompleted,
  setIsEmpty,
  refetchLists,
}: ListItemProps) => {
  const [toastText, setToastText] = useState("");
  const prevAllCompletedRef = useRef(false);
  const didMountRef = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditMode && Array.isArray(list?.items)) {
      setEditedItems([...list.items]);
    } else {
      setEditedItems([]);
    }
  }, [isEditMode, list, setEditedItems]);

  const allCompleted = useMemo(() => {
    const items = list?.items ?? [];
    return items.length > 0 && items.every((item) => item.completed);
  }, [list?.items]);

  useEffect(() => {
    const itemsLength = list?.items?.length ?? 0;
    setIsEmpty(itemsLength === 0);
  }, [list, setIsEmpty]);

  useEffect(() => {
    if (didMountRef.current) {
      if (allCompleted && !prevAllCompletedRef.current) {
        setIsCompleted(true);
        setToastText(`The ${list?.id} list is completed. Nice job!`);
        refetchLists();
      } else if (!allCompleted) {
        setIsCompleted(false);
        setToastText("");
      }
    } else {
      setIsCompleted(allCompleted);
      didMountRef.current = true;
    }

    prevAllCompletedRef.current = allCompleted;
  }, [allCompleted, list?.id, setIsCompleted, refetchLists]);

  const itemsToDisplay = isEditMode ? editedItems : (list?.items ?? []);

  return (
    <>
      {(list?.items?.length ?? 0) > 0 ? (
        <>
          {toastText && <Toast text={toastText} />}
          <ul className="bg-white rounded-[12px] overflow-hidden">
            {itemsToDisplay.map((item) => (
              <li
                key={item.id}
                className={`flex gap-[13px] items-center justify-between h-[58px] px-4 ${item.completed && !isCompleted ? "bg-[#faf9f8]" : ""}`}
              >
                {!isCompleted && !isEditMode && (
                  <button
                    type="button"
                    className={`rounded-[8px] border-[1px] min-w-[22px] w-[22px] h-[22px] flex items-center justify-center ${item.completed ? "bg-[#43BD0E] border-[#43BD0E] cursor-not-allowed" : "border-[#D8D8D8] cursor-pointer"}`}
                    aria-label={
                      item.completed ? "Completed" : "Mark as complete"
                    }
                    disabled={item.completed}
                    onClick={() => {
                      completeItem([item.id]);
                      queryClient.invalidateQueries({
                        queryKey: ["shoppingLists"],
                      });
                    }}
                  >
                    {item.completed && <CheckIcon />}
                  </button>
                )}
                {isEditMode &&
                  (item.completed ? (
                    <div className="rounded-[8px] w-[22px] h-[22px] bg-[#F4F4F6] flex items-center justify-center">
                      <CheckGrayIcon />
                    </div>
                  ) : (
                    <DeleteIcon
                      className="cursor-pointer w-5 h-5 mr-0.5"
                      onClick={() => {
                        setEditedItems((prev) =>
                          prev.filter((i) => i.id !== item.id),
                        );
                      }}
                    />
                  ))}
                <span
                  className={`mr-auto truncate whitespace-nowrap overflow-hidden ${item.completed && !isCompleted ? "text-[#C1C3CA] line-through" : ""}`}
                >
                  {item.name}
                </span>
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`text-[#E44432] flex items-center justify-center w-[22px] h-[22px] rounded-[8px] bg-[#FFF0F0] hover:bg-[#FFDCDC] active:opacity-50 ${item.completed ? "!opacity-0 cursor-default" : ""}`}
                      onClick={() => {
                        const updated =
                          item.amount === BigInt(1)
                            ? editedItems.filter((i) => i.id !== item.id)
                            : editedItems.map((i) =>
                                i.id === item.id
                                  ? {
                                      ...i,
                                      amount: i.amount - BigInt(1),
                                      completed: false,
                                    }
                                  : i,
                              );

                        setEditedItems(updated);
                      }}
                    >
                      -
                    </button>
                    <span
                      className={`w-[50px] text-center leading-[22px] ${item.completed ? "text-[#C1C3CA] line-through" : ""}`}
                    >
                      {item.amount}
                    </span>
                    <button
                      type="button"
                      className={`text-[#43BD0E] flex items-center justify-center w-[22px] h-[22px] rounded-[8px] bg-[#EFF9EC] hover:bg-[#C9F8B5] active:opacity-50 ${item.completed ? "!opacity-0 cursor-default" : ""}`}
                      onClick={() => {
                        const updated = editedItems.map((i) =>
                          i.id === item.id
                            ? {
                                ...i,
                                amount: i.amount + BigInt(1),
                                completed: false,
                              }
                            : i,
                        );
                        setEditedItems(updated);
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span
                    className={`${item.completed && !isCompleted ? "text-[#C1C3CA] line-through" : ""}`}
                  >
                    {item.amount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="h-full flex flex-col justify-center items-center gap-3">
          <img src={EmptyPict} alt="Buyo empty" />
          <p className="text-[#C1C3CA] leading-[22px] mb-auto">
            This list is empty.
          </p>
        </div>
      )}
    </>
  );
};
