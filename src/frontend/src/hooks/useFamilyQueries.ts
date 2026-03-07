import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShoppingListItem } from "../backend";
import { useActor } from "./useActor.js";

export const useFamilyShoppingLists = (familyName: string) => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["familyShoppingLists", familyName],
    queryFn: async () => {
      return await actor?.getFamilyShoppingLists(familyName);
    },
    enabled: !!actor && !!familyName,
  });
};

export const useFamilyShoppingList = (
  familyName: string,
  listId: bigint | null,
) => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["familyShoppingList", familyName, listId?.toString() ?? null],
    queryFn: async () => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.getFamilyShoppingList(familyName, listId);
    },
    enabled: !!actor && !!familyName && listId !== null,
  });
};

export const useAddFamilyShoppingList = (familyName: string) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return await actor?.addFamilyShoppingList(familyName, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["familyShoppingLists", familyName],
      });
    },
  });
};

export const useCloneFamilyShoppingList = (familyName: string) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      return await actor?.cloneFamilyShoppingList(familyName, id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["familyShoppingLists", familyName],
      });
    },
  });
};

export const useDeleteFamilyShoppingLists = (familyName: string) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listIds: bigint[]) => {
      return await actor?.deleteFamilyShoppingLists(familyName, listIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["familyShoppingLists", familyName],
      });
    },
  });
};

export const useFamilyAvailableItems = (
  familyName: string,
  searchQuery: string,
) => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["familyAvailableListItems", familyName, searchQuery],
    queryFn: async () => {
      return await actor?.getFamilyCatalogItemsPaginated(familyName, {
        sortOrder: { asc: true },
        page: BigInt(0),
        pageSize: BigInt(5),
        search: searchQuery,
      });
    },
    enabled: !!actor && !!familyName,
  });
};

export const useAddFamilyAvailableItem = (familyName: string) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return await actor?.addFamilyListItem(familyName, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["familyAvailableListItems", familyName],
      });
    },
  });
};

export const useAddFamilyShoppingListItem = (
  familyName: string,
  listId: bigint | null,
) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ShoppingListItem[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.addItemsToFamilyShoppingList(
        familyName,
        listId,
        item,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "familyShoppingList",
          familyName,
          listId?.toString() ?? null,
        ],
      });
    },
  });
};

export const useCompleteItemInFamily = (
  familyName: string,
  listId: bigint | null,
) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: bigint[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.completeItemsInFamily(familyName, listId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "familyShoppingList",
          familyName,
          listId?.toString() ?? null,
        ],
      });
    },
  });
};

export const useRemoveItemFromFamilyShoppingList = (
  familyName: string,
  listId: bigint | null,
) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.removeItemFromFamilyShoppingList(
        familyName,
        listId,
        id,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "familyShoppingList",
          familyName,
          listId?.toString() ?? null,
        ],
      });
    },
  });
};

export const useEditItemInFamily = (
  familyName: string,
  listId: bigint | null,
) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ShoppingListItem[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.editItemsInFamilyShoppingList(
        familyName,
        listId,
        item,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "familyShoppingList",
          familyName,
          listId?.toString() ?? null,
        ],
      });
    },
  });
};
