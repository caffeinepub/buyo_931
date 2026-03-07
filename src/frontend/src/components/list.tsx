import type { ShoppingListResponse } from "../backend";
import { Screen } from "../types";
import { DeleteIcon, DuplicateIcon } from "./Icons";

interface ListProps {
  lists: ShoppingListResponse[] | undefined;
  setScreen: (value: Screen) => void;
  setListId: (value: bigint) => void;
  setListItemsToDelete: (value: bigint) => void;
  setIsCloneModalOpen: (value: boolean) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
  setCloneName: (value: string) => void;
  isEditMode: boolean;
  listId?: bigint | null;
}

export const List = ({
  setScreen,
  setListId,
  setListItemsToDelete,
  lists,
  setIsCloneModalOpen,
  setIsDeleteModalOpen,
  setCloneName,
  isEditMode,
  listId,
}: ListProps) => {
  return (
    <>
      {lists?.length ? (
        <ul>
          {lists.map((list) => (
            <li
              key={list.id}
              className={`cursor-pointer h-[58px] p-4 flex justify-between items-center rounded-[12px] gap-3 mb-2.5 relative
                ${list.items.length && list.items.every((item) => item.completed) ? "bg-[#FFFFFF80]" : "bg-white"}
                ${listId === list.id ? "!bg-[#EAE9E8]" : ""}
                `}
              onClick={() => {
                if (isEditMode) return;
                setScreen(Screen.SUBLIST);
                setListId(list.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isEditMode) {
                  setScreen(Screen.SUBLIST);
                  setListId(list.id);
                }
              }}
              tabIndex={isEditMode ? undefined : 0}
            >
              {isEditMode && (
                <DeleteIcon
                  className="cursor-pointer w-5 h-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setListItemsToDelete(list.id);
                    setIsDeleteModalOpen(true);
                  }}
                />
              )}
              <span
                className={`mr-auto truncate whitespace-nowrap overflow-hidden ${list.items.length && list.items.every((item) => item.completed) ? "text-[#C1C3CA] line-through" : "text-black"}`}
              >
                {list.name}
              </span>
              {!isEditMode && (
                <DuplicateIcon
                  className="w-5 h-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCloneModalOpen(true);
                    setCloneName(`${list.name} - Clone`);
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        "no data"
      )}
    </>
  );
};
