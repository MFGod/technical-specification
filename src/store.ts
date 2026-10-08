import { create } from "zustand";
import { toForm, validateAccount, type Account } from "./accounts";

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
      JSON.stringify(
        accounts.filter(
          (account) => !Object.keys(validateAccount(toForm(account))).length,
        ),
      ),
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

export const useAccountsStore = create<AccountsStore>((set) => ({
  accounts: load(),
  storageError: false,
  addAccount: () => {
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
