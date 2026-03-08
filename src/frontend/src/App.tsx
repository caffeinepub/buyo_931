import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import BgImage from "/assets/bg-x2.png";
import EmptyPict from "/assets/sublist-empty.png";
import type {
  ListItem,
  ShoppingList,
  ShoppingListItem,
  ShoppingListItemResponse,
} from "./backend";
import { AddIcon, EditIcon, ShareIcon } from "./components/Icons";
import { Button } from "./components/button";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { List } from "./components/list";
import { Loader } from "./components/loader";
import { Modal } from "./components/modal";
import { ModalAddContent } from "./components/modal-add-content";
import { ModalCloneContent } from "./components/modal-clone-content";
import { ModalCreateContent } from "./components/modal-create-content";
import { ModalDeleteContent } from "./components/modal-delete-content";
import { Onboarding } from "./components/onboarding";
import { Start } from "./components/start";
import { Sublist } from "./components/sublist";
import { useActor } from "./hooks/useActor";
import {
  useAddFamilyAvailableItem,
  useAddFamilyShoppingList,
  useAddFamilyShoppingListItem,
  useCloneFamilyShoppingList,
  useCompleteItemInFamily,
  useDeleteFamilyShoppingLists,
  useEditItemInFamily,
  useFamilyAvailableItems,
  useFamilyShoppingList,
  useFamilyShoppingLists,
} from "./hooks/useFamilyQueries";
import { useIsDesktop } from "./hooks/useIsDesktop";
import {
  useAddAvailableItem,
  useAddShoppingList,
  useAddShoppingListItem,
  useAvailableItems,
  useCloneShoppingList,
  useCompleteItem,
  useDeleteShoppingLists,
  useEditItem,
  useShoppingList,
  useShoppingLists,
} from "./hooks/useQueries";
import { ButtonType, type FamilySession, Screen } from "./types";
import { getFooterMarkup, getHeaderMarkup, share } from "./utils";

const SESSION_KEY = "buyo_session";

type PersistedSession =
  | { type: "single" }
  | { type: "family"; familyName: string; memberName: string };

function loadPersistedSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

function saveSession(session: PersistedSession | null) {
  if (session === null) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export const App = () => {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();
  const isDesktop = useIsDesktop();

  const [familySession, setFamilySession] = useState<FamilySession | null>(
    () => {
      const persisted = loadPersistedSession();
      if (persisted?.type === "family") {
        return {
          familyName: persisted.familyName,
          memberName: persisted.memberName,
        };
      }
      return null;
    },
  );

  const [editedItems, setEditedItems] = useState<ShoppingListItemResponse[]>(
    [],
  );

  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number | undefined>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isListEditMode, setIsListEditMode] = useState(false);
  const [isSublistEditMode, setIsSublistEditMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const [screen, setScreen] = useState<Screen>(() => {
    const persisted = loadPersistedSession();
    if (persisted?.type === "family") return Screen.LIST;
    if (persisted?.type === "single") return Screen.START;
    return Screen.ONBOARDING;
  });
  const [listId, setListId] = useState<bigint | null>(null);
  const [listItemsToDelete, setListItemsToDelete] = useState<
    bigint | undefined
  >();

  const isFamilyMode = familySession !== null;
  const familyName = familySession?.familyName ?? "";

  // Single-user hooks
  const { data: singleLists, isFetching: isSingleListsLoading } =
    useShoppingLists();
  const { data: singleList, isFetching: isSingleListLoading } = useShoppingList(
    isFamilyMode ? null : listId,
  );
  const {
    mutateAsync: singleAddList,
    isPending: singleAddListLoading,
    error: singleAddListError,
    reset: singleAddListReset,
  } = useAddShoppingList();
  const { mutateAsync: singleClone, isPending: singleCloneLoading } =
    useCloneShoppingList();
  const { mutateAsync: singleDeleteLists, isPending: singleRemoveListLoading } =
    useDeleteShoppingLists();
  const {
    data: singleAvailableItems,
    isFetching: isSingleAvailableItemLoading,
  } = useAvailableItems(isFamilyMode ? "" : newItemName);
  const {
    mutateAsync: singleAddAvailableItem,
    isPending: singleAddAvailableLoading,
  } = useAddAvailableItem();
  const {
    mutateAsync: singleAddShoppingItem,
    error: singleAddShoppingItemError,
    reset: singleAddShoppingItemReset,
  } = useAddShoppingListItem(isFamilyMode ? null : listId);
  const { mutateAsync: singleCompleteItem } = useCompleteItem(
    isFamilyMode ? null : listId,
  );
  const {
    mutateAsync: singleEditShoppingItem,
    isPending: singleEditShoppingItemLoading,
  } = useEditItem(isFamilyMode ? null : listId);

  // Family hooks
  const { data: familyLists, isFetching: isFamilyListsLoading } =
    useFamilyShoppingLists(familyName);
  const { data: familyList, isFetching: isFamilyListLoading } =
    useFamilyShoppingList(familyName, isFamilyMode ? listId : null);
  const {
    mutateAsync: familyAddList,
    isPending: familyAddListLoading,
    error: familyAddListError,
    reset: familyAddListReset,
  } = useAddFamilyShoppingList(familyName);
  const { mutateAsync: familyClone, isPending: familyCloneLoading } =
    useCloneFamilyShoppingList(familyName);
  const { mutateAsync: familyDeleteLists, isPending: familyRemoveListLoading } =
    useDeleteFamilyShoppingLists(familyName);
  const {
    data: familyAvailableItems,
    isFetching: isFamilyAvailableItemLoading,
  } = useFamilyAvailableItems(familyName, isFamilyMode ? newItemName : "");
  const {
    mutateAsync: familyAddAvailableItem,
    isPending: familyAddAvailableLoading,
  } = useAddFamilyAvailableItem(familyName);
  const {
    mutateAsync: familyAddShoppingItem,
    error: familyAddShoppingItemError,
    reset: familyAddShoppingItemReset,
  } = useAddFamilyShoppingListItem(familyName, isFamilyMode ? listId : null);
  const { mutateAsync: familyCompleteItem } = useCompleteItemInFamily(
    familyName,
    isFamilyMode ? listId : null,
  );
  const {
    mutateAsync: familyEditShoppingItem,
    isPending: familyEditShoppingItemLoading,
  } = useEditItemInFamily(familyName, isFamilyMode ? listId : null);

  // Unified aliases
  const lists = isFamilyMode ? familyLists : singleLists;
  const list = isFamilyMode ? familyList : singleList;
  const isListsLoading = isFamilyMode
    ? isFamilyListsLoading
    : isSingleListsLoading;
  const isListLoading = isFamilyMode
    ? isFamilyListLoading
    : isSingleListLoading;
  const addListLoading = isFamilyMode
    ? familyAddListLoading
    : singleAddListLoading;
  const addListError = isFamilyMode ? familyAddListError : singleAddListError;
  const addListReset = isFamilyMode ? familyAddListReset : singleAddListReset;
  const cloneLoading = isFamilyMode ? familyCloneLoading : singleCloneLoading;
  const removeListLoading = isFamilyMode
    ? familyRemoveListLoading
    : singleRemoveListLoading;
  const availableItems = isFamilyMode
    ? familyAvailableItems
    : singleAvailableItems;
  const isAvailableItemLoading = isFamilyMode
    ? isFamilyAvailableItemLoading
    : isSingleAvailableItemLoading;
  const addAvailableLoading = isFamilyMode
    ? familyAddAvailableLoading
    : singleAddAvailableLoading;
  const addShoppingItemError = isFamilyMode
    ? familyAddShoppingItemError
    : singleAddShoppingItemError;
  const addShoppingItemReset = isFamilyMode
    ? familyAddShoppingItemReset
    : singleAddShoppingItemReset;
  const editShoppingItemLoading = isFamilyMode
    ? familyEditShoppingItemLoading
    : singleEditShoppingItemLoading;

  const addList = isFamilyMode ? familyAddList : singleAddList;
  const clone = isFamilyMode ? familyClone : singleClone;
  const deleteLists = isFamilyMode ? familyDeleteLists : singleDeleteLists;
  const addAvailableItem = isFamilyMode
    ? familyAddAvailableItem
    : singleAddAvailableItem;
  const addShoppingItem = isFamilyMode
    ? familyAddShoppingItem
    : singleAddShoppingItem;
  const completeItem = isFamilyMode ? familyCompleteItem : singleCompleteItem;
  const editShoppingItem = isFamilyMode
    ? familyEditShoppingItem
    : singleEditShoppingItem;

  const shoppingListQueryKey = isFamilyMode
    ? ["familyShoppingList", familyName, listId?.toString() ?? null]
    : ["shoppingLists"];

  const filteredLists = useMemo(() => {
    if (!lists) return [];

    return [...lists].sort((a, b) => {
      const aEmpty = a.items.length === 0;
      const bEmpty = b.items.length === 0;

      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return -1;
      if (bEmpty) return 1;

      const aCompleted = a.items.every(
        (item: ShoppingListItem) => item.completed,
      );
      const bCompleted = b.items.every(
        (item: ShoppingListItem) => item.completed,
      );

      return Number(aCompleted) - Number(bCompleted);
    });
  }, [lists]);

  useEffect(() => {
    if (screen === Screen.ONBOARDING) return;
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");

    if (idParam) {
      const found = lists?.find(
        (list: ShoppingList) => list.id === BigInt(idParam),
      );
      if (found === undefined || found === null) return;
      try {
        const idBigInt = BigInt(idParam);
        setListId(idBigInt);
        setScreen(Screen.SUBLIST);
      } catch (_err) {
        console.warn("Invalid ID param in URL:", idParam);
      }
    }
  }, [lists, screen]);

  useEffect(() => {
    if (!actor || isFamilyMode) return;

    actor.isInited().then((value: boolean) => {
      if (!value) {
        actor.init([]).then(() => {
          queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
        });
      }
    });
  }, [actor, queryClient, isFamilyMode]);

  const createList = useCallback(async () => {
    if (!newListName.trim()) return;

    const lists = await addList(newListName);
    setNewListName("");
    setIsCloneModalOpen(false);
    setIsCreateModalOpen(false);

    if (isDesktop && lists && lists.length > 0) {
      setListId(lists[lists.length - 1].id);
    }
  }, [newListName, addList, isDesktop]);

  const cloneList = useCallback(async () => {
    if (listId == null || !newListName.trim()) return;
    const cloned = await clone({ id: listId, name: newListName });
    setNewListName("");
    setIsCloneModalOpen(false);
    setIsCreateModalOpen(false);

    if (isDesktop && cloned) {
      setListId(cloned.id);
    }
  }, [newListName, clone, isDesktop, listId]);

  const removeLists = useCallback(async () => {
    if (listItemsToDelete == null) return;

    await deleteLists([listItemsToDelete]);
    setIsDeleteModalOpen(false);
  }, [listItemsToDelete, deleteLists]);

  const addItem = useCallback(async () => {
    if (newItemAmount == null || newItemAmount === 0) return;

    let foundItem: ListItem | undefined;

    if (
      !availableItems?.items.find((item: ListItem) => item.name === newItemName)
    ) {
      const newItem = await addAvailableItem(newItemName);
      foundItem = newItem;
    } else {
      foundItem = availableItems.items.find(
        (item: ListItem) => item.name === newItemName,
      );
    }

    if (foundItem == null || foundItem.id == null) return;

    await addShoppingItem([
      {
        id: foundItem.id,
        completed: false,
        amount: BigInt(newItemAmount),
      },
    ]);

    setNewItemAmount(undefined);
    setNewItemName("");
    setIsAddModalOpen(false);
  }, [
    newItemAmount,
    newItemName,
    availableItems,
    addAvailableItem,
    addShoppingItem,
  ]);

  useEffect(() => {
    if (
      isDesktop &&
      screen === Screen.LIST &&
      filteredLists?.length &&
      listId == null
    ) {
      const first = filteredLists[0];
      setListId(first.id);
      setScreen(Screen.SUBLIST);
    }
  }, [isDesktop, screen, filteredLists, listId]);

  const handleSignOut = () => {
    saveSession(null);
    setFamilySession(null);
    setScreen(Screen.ONBOARDING);
    setListId(null);
    queryClient.clear();
  };

  const headerSubtitle = familySession
    ? `${familySession.familyName} · ${familySession.memberName}`
    : undefined;

  const getMainMarkup = () => {
    if (screen === Screen.ONBOARDING) {
      return (
        <Onboarding
          actor={actor}
          onSingleList={() => {
            saveSession({ type: "single" });
            setScreen(Screen.START);
          }}
          onFamilyJoined={(session: FamilySession) => {
            saveSession({
              type: "family",
              familyName: session.familyName,
              memberName: session.memberName,
            });
            setFamilySession(session);
            setScreen(Screen.LIST);
          }}
        />
      );
    }

    if (isDesktop) {
      switch (screen) {
        case Screen.START:
          return <Start setScreen={setScreen} isLoading={isActorFetching} />;

        case Screen.LIST:
        case Screen.SUBLIST:
          return (
            <>
              {filteredLists?.length > 0 ? (
                <div
                  className="flex relative"
                  style={{ height: "calc(100vh - 96px)" }}
                >
                  <aside className="h-full w-[322px] pr-[30px] flex flex-col gap-5 pb-4 relative">
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 170px)" }}
                    >
                      <List
                        setScreen={setScreen}
                        setIsCloneModalOpen={setIsCloneModalOpen}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        setListId={setListId}
                        listId={isDesktop && listId}
                        setListItemsToDelete={setListItemsToDelete}
                        lists={filteredLists}
                        setCloneName={setNewListName}
                        isEditMode={isListEditMode}
                      />
                    </div>
                    {!isListEditMode && (
                      <div className="mt-auto">
                        <Button
                          btnType={ButtonType.SECONDARY}
                          text="Create new list"
                          onClick={() => setIsCreateModalOpen(true)}
                        />
                      </div>
                    )}
                  </aside>
                  <main
                    className={`z-[4] flex-1 pt-[20px] px-[30px] h-full flex flex-col gap-5 pb-4 relative rounded-[12px] ${isSublistEditMode ? "bg-[#EAE9E8]" : "bg-[#EAE9E8]"}`}
                  >
                    <div
                      className={`absolute backdrop-blur-lg bg-[#EAE9E8E5] left-0 top-0 w-full h-full rounded-[12px] ${isListEditMode ? "block" : "hidden"}`}
                    />
                    <div className="font-bold text-[24px] leading-10 flex items-center justify-between">
                      <span>
                        {isSublistEditMode && "Edit "}
                        {list?.name}
                      </span>
                      <div
                        className={`flex bg-white rounded-[12px] ${isListEditMode ? "z-[-1]" : ""}`}
                      >
                        {isSublistEditMode ? (
                          <button
                            type="button"
                            className="w-[60px] relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none"
                            onClick={() => {
                              editShoppingItem(editedItems);
                              setEditedItems([]);
                              setIsSublistEditMode(false);
                            }}
                          >
                            <span className="font-bold text-[#BD7760] text-[16px]">
                              Done
                            </span>
                          </button>
                        ) : (
                          <>
                            {!isCompleted && !isEmpty && (
                              <button
                                type="button"
                                className="w-10 relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none"
                                onClick={() => {
                                  setIsSublistEditMode(true);
                                }}
                              >
                                <EditIcon />
                              </button>
                            )}
                            <button
                              type="button"
                              className={`w-10 relative h-10 flex items-center justify-center cursor-pointer bg-[#FFFFFFBF] hover:bg-white transition-all duration-200 ease-in-out rounded-[12px] select-none ${!isCompleted && !isEmpty ? "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-[#f0f0f0]" : ""}`}
                              onClick={() => share(listId)}
                            >
                              <ShareIcon />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 272px)" }}
                    >
                      <Sublist
                        list={list}
                        isEditMode={isSublistEditMode}
                        completeItem={completeItem}
                        editedItems={editedItems}
                        setEditedItems={setEditedItems}
                        isCompleted={isCompleted}
                        setIsCompleted={setIsCompleted}
                        setIsEmpty={setIsEmpty}
                        refetchLists={() =>
                          queryClient.invalidateQueries({
                            queryKey: shoppingListQueryKey,
                          })
                        }
                      />
                    </div>
                    {!isSublistEditMode && !isCompleted && (
                      <div className="mt-auto">
                        <Button
                          icon={AddIcon}
                          btnType={ButtonType.PRIMARY}
                          text="Add new item"
                          onClick={() => setIsAddModalOpen(true)}
                        />
                      </div>
                    )}
                  </main>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center gap-3">
                  <img src={EmptyPict} alt="Buyo empty" />
                  <p className="text-[#C1C3CA] leading-[22px]">
                    This list is empty.
                  </p>
                  <div className="mt-auto">
                    <Button
                      btnType={ButtonType.SECONDARY}
                      text="Create new list"
                      onClick={() => setIsCreateModalOpen(true)}
                      width={293}
                    />
                  </div>
                </div>
              )}
            </>
          );

        default:
          return <div>Page not found</div>;
      }
    }

    switch (screen) {
      case Screen.START:
        return <Start setScreen={setScreen} isLoading={isActorFetching} />;
      case Screen.LIST:
        return (
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            <List
              setScreen={setScreen}
              setIsCloneModalOpen={setIsCloneModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setListId={setListId}
              setListItemsToDelete={setListItemsToDelete}
              lists={filteredLists}
              setCloneName={setNewListName}
              isEditMode={isListEditMode}
            />
          </div>
        );
      case Screen.SUBLIST:
        return (
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            <Sublist
              list={list}
              isEditMode={isSublistEditMode}
              completeItem={completeItem}
              editedItems={editedItems}
              setEditedItems={setEditedItems}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              setIsEmpty={setIsEmpty}
              refetchLists={() =>
                queryClient.invalidateQueries({
                  queryKey: shoppingListQueryKey,
                })
              }
            />
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  const isInitialLoading =
    (!lists && isListsLoading) || (!list && isListLoading);

  const isAnyLoading =
    isInitialLoading ||
    isListsLoading ||
    isListLoading ||
    isActorFetching ||
    editShoppingItemLoading ||
    removeListLoading;

  const showLoader =
    isAnyLoading && screen !== Screen.START && screen !== Screen.ONBOARDING;

  return (
    <div
      className="m-auto px-[16px] py-[24px] h-full w-full relative"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {showLoader && <Loader />}
      <div
        className={`absolute backdrop-blur-lg z-[3] bg-[#00000033] left-0 top-0 w-full h-full rounded-[12px] ${isSublistEditMode && isDesktop ? "block" : "hidden"}`}
      />
      <Modal
        isOpen={isCreateModalOpen}
        submitButtontext="Create"
        onSubmit={() => createList()}
        disabled={!newListName || !!addListError || addListLoading}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewListName("");
          addListReset();
        }}
      >
        <ModalCreateContent
          error={Boolean(addListError)}
          value={newListName}
          setValue={(v) => {
            setNewListName(v);
            if (addListError) addListReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isCloneModalOpen}
        submitButtontext="Clone"
        onSubmit={() => {
          cloneList();
        }}
        disabled={!newListName || cloneLoading}
        onClose={() => {
          setIsCloneModalOpen(false);
          setNewListName("");
          addListReset();
        }}
      >
        <ModalCloneContent
          error={Boolean(addListError)}
          value={newListName}
          setValue={(v) => {
            setNewListName(v);
            if (addListError) addListReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isAddModalOpen}
        submitButtontext="Add"
        onSubmit={addItem}
        disabled={
          isAvailableItemLoading || newItemAmount == null || newItemAmount === 0
        }
        onClose={() => {
          setIsAddModalOpen(false);
          setNewItemName("");
          setNewItemAmount(undefined);
        }}
      >
        <ModalAddContent
          value={newItemName}
          amount={newItemAmount}
          setAmount={setNewItemAmount}
          title={list?.name}
          error={Boolean(addShoppingItemError)}
          items={availableItems}
          setValue={(v) => {
            setNewItemName(v);
            if (addShoppingItemError) addShoppingItemReset();
          }}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        isDeletion
        submitButtontext="Delete"
        onSubmit={removeLists}
        disabled={isAvailableItemLoading || addAvailableLoading}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNewListName("");
        }}
      >
        <ModalDeleteContent />
      </Modal>
      <div className="h-full flex flex-col">
        {screen !== Screen.ONBOARDING && (
          <Header
            {...getHeaderMarkup(
              screen,
              isListEditMode,
              isSublistEditMode,
              setIsSublistEditMode,
              setIsListEditMode,
              listId,
              editedItems,
              setEditedItems,
              editShoppingItem,
              isDesktop,
              list?.name,
              isCompleted,
              (lists?.length ?? 0) === 0,
              isEmpty,
            )}
            subtitle={headerSubtitle}
            onSignOut={handleSignOut}
            backhandler={() => {
              setScreen(Screen.LIST);
              setIsCompleted(false);
              setIsEmpty(true);
            }}
            buttonBlurred={isSublistEditMode && isDesktop}
          />
        )}
        {getMainMarkup()}
        {!isDesktop && screen !== Screen.ONBOARDING && (
          <Footer
            buttons={getFooterMarkup(
              screen,
              setIsCreateModalOpen,
              setIsAddModalOpen,
              isListEditMode,
              isSublistEditMode,
              isCompleted,
              isEmpty,
            )}
          />
        )}
      </div>
    </div>
  );
};

export default App;
