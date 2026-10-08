import { create } from "zustand";
import { isAccountValid, type Account } from "./accounts";

const STORAGE_KEY = "technical-specification.accounts";

const load = (): Account[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const save = (accounts: Account[]) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(accounts.filter(isAccountValid)),
    );
    return { accounts, storageError: false };
  } catch {
    return { accounts, storageError: true };
  }
};

interface AccountsStore {
  accounts: Account[];
  storageError: boolean;
  addAccount: () => string;
  updateAccount: (account: Account) => void;
  removeAccount: (id: string) => void;
}

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: load(),
  storageError: false,
  addAccount: () => {
    const lastAccount = get().accounts.at(-1);
    if (lastAccount && !isAccountValid(lastAccount)) return "";
    const id = crypto.randomUUID();
    set((state) => ({
      accounts: [
        ...state.accounts,
        { id, labels: [], type: "local", login: "", password: "" },
      ],
    }));
    return id;
  },
  updateAccount: (account) =>
    set((state) =>
      save(
        state.accounts.map((item) => (item.id === account.id ? account : item)),
      ),
    ),
  removeAccount: (id) =>
    set((state) => save(state.accounts.filter((account) => account.id !== id))),
}));
