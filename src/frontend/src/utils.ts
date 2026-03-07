import type { ShoppingListItemResponse } from "./backend";
import { AddIcon, EditIcon, ShareIcon } from "./components/Icons";
import type { FooterButton } from "./components/footer";
import { ButtonType, type HeaderConfig, Screen } from "./types";

export const share = async (id: bigint | null) => {
  if (id == null) return;

  const shareData = {
    title: "Buyo",
    text: "Click the link to join our Buyo List",
    url: `${window.location.href}?id=${id.toString()}`,
  };

  if (typeof navigator.share === "function") {
    try {
      navigator.share(shareData);
    } catch (err) {
      console.error("Share failed: ", err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareData.url);
    } catch (e) {
      console.error("Copy failed: ", e);
    }
  }
};

export function getHeaderMarkup(
  screen: Screen,
  isListEditMode: boolean,
  isSublistEditMode: boolean,
  setIsSublistEditMode: (value: boolean) => void,
  setIsListEditMode: (value: boolean) => void,
  listId: bigint | null,
  editedItems: ShoppingListItemResponse[],
  setEditedItems: (value: ShoppingListItemResponse[]) => void,
  editShoppingItem: any,
  isDesktop: boolean,
  listName?: string,
  isCompleted?: boolean,
  isEmpty?: boolean,
  isSublistEmpty?: boolean,
): HeaderConfig {
  switch (screen) {
    case Screen.START:
      return { text: "", hasBackBtn: false, buttons: [] };

    case Screen.LIST:
      if (isListEditMode) {
        return {
          text: null,
          hasBackBtn: false,
          buttons: [
            {
              icon: null,
              action: () => setIsListEditMode(false),
            },
          ],
        };
      }
      if (isEmpty === true) {
        return {
          text: null,
          hasBackBtn: false,
          buttons: [],
        };
      }
      return {
        text: null,
        hasBackBtn: false,
        buttons: [
          {
            icon: EditIcon,
            action: () => setIsListEditMode(true),
            id: "edit",
          },
        ],
      };

    case Screen.SUBLIST:
      if (isDesktop) {
        if (isListEditMode) {
          return {
            text: null,
            hasBackBtn: false,
            buttons: [
              {
                icon: null,
                action: () => setIsListEditMode(false),
              },
            ],
          };
        }
        return {
          text: null,
          hasBackBtn: false,
          buttons: [
            {
              icon: EditIcon,
              action: () => setIsListEditMode(true),
              id: "edit",
            },
          ],
        };
      }
      if (isSublistEditMode) {
        return {
          text: `Edit ${listName}` || "",
          hasBackBtn: false,
          buttons: [
            {
              icon: null,
              action: () => {
                editShoppingItem(editedItems);
                setEditedItems([]);
                setIsSublistEditMode(false);
              },
            },
          ],
        };
      }
      return {
        text: listName || "",
        hasBackBtn: true,
        buttons: [
          ...(isCompleted !== true && isSublistEmpty !== true
            ? [
                {
                  icon: EditIcon,
                  action: () => setIsSublistEditMode(true),
                  id: "edit",
                },
              ]
            : []),
          {
            icon: ShareIcon,
            action: () => share(listId),
            id: "share",
          },
        ],
      };

    default:
      return { text: "Buyo", hasBackBtn: false, buttons: [] };
  }
}

export function getFooterMarkup(
  screen: Screen,
  setIsCreateModalOpen: (value: boolean) => void,
  setIsAddModalOpen: (value: boolean) => void,
  isListEditMode: boolean,
  isSublistEditMode: boolean,
  isCompleted?: boolean,
  isEmpty?: boolean,
): FooterButton[] {
  switch (screen) {
    case Screen.LIST:
      if (isListEditMode) {
        return [];
      }

      return [
        {
          icon: null,
          text: "Create new list",
          action: () => setIsCreateModalOpen(true),
          style: ButtonType.PRIMARY,
        },
      ];
    case Screen.SUBLIST:
      if ((isCompleted === true && isEmpty !== true) || isSublistEditMode)
        return [];
      return [
        {
          icon: AddIcon,
          text: "Add new item",
          action: () => setIsAddModalOpen(true),
          style: ButtonType.PRIMARY,
        },
      ];
    default:
      return [];
  }
}
