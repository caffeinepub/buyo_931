import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShoppingListItem } from "../backend";
import { useActor } from "./useActor.js";

export const useShoppingLists = () => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["shoppingLists"],
    queryFn: async () => {
      return await actor?.getShoppingLists();
    },
    enabled: !!actor,
  });
};

export const useShoppingList = (listId: bigint | null) => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["shoppingList", listId?.toString() ?? null],
    queryFn: async () => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.getShoppingList(listId);
    },
    enabled: !!actor && listId !== null,
  });
};

export const useAddShoppingList = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return await actor?.addShoppingList(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};

export const useCloneShoppingList = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      return await actor?.cloneShoppingList(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};

export const useDeleteShoppingLists = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listIds: bigint[]) => {
      return await actor?.deleteShoppingLists(listIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};

export const useAvailableItems = (searchQuery: string) => {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["availableListItems", searchQuery],
    queryFn: async () => {
      return await actor?.getListItemsPaginated({
        sortOrder: { asc: true },
        page: BigInt(0),
        pageSize: BigInt(5),
        search: searchQuery,
      });
    },
    enabled: !!actor,
  });
};

export const useAddAvailableItem = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return await actor?.addListItem(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableListItems"] });
    },
  });
};

export const useAddShoppingListItem = (listId: bigint | null) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ShoppingListItem[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.addItemsToShoppingList(listId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shoppingList", listId?.toString() ?? null],
      });
    },
  });
};

export const useCompleteItem = (listId: bigint | null) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: bigint[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.completeItems(listId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shoppingList", listId?.toString() ?? null],
      });
    },
  });
};

export const useDeleteItem = (listId: bigint | null) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.removeItemFromShoppingList(listId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shoppingList", listId?.toString() ?? null],
      });
    },
  });
};

export const useEditItem = (listId: bigint | null) => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ShoppingListItem[]) => {
      if (listId === null) throw new Error("Invalid call: missing id");
      return await actor?.editItemsInShoppingList(listId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shoppingList", listId?.toString() ?? null],
      });
    },
  });
};
