export const MAX_LABEL_LENGTH = 50;
export const MAX_CREDENTIAL_LENGTH = 100;
const LABEL_SEPARATOR = ";";

export type AccountType = "local" | "ldap";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  local: "Локальная",
  ldap: "LDAP",
};

export interface Account {
  id: string;
  labels: { text: string }[];
  type: AccountType;
  login: string;
  password: string | null;
}

export interface AccountForm {
  labels: string;
  type: AccountType;
  login: string;
  password: string;
}

export interface AccountErrors {
  login?: string;
  password?: string;
}

export const toForm = (account: Account): AccountForm => ({
  labels: account.labels.map(({ text }) => text).join(LABEL_SEPARATOR),
  type: account.type,
  login: account.login,
  password: account.password ?? "",
});

export const toAccount = (id: string, form: AccountForm): Account => ({
  id,
  type: form.type,
  login: form.login,
  labels: form.labels
    .split(LABEL_SEPARATOR)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text })),
  password: form.type === "ldap" ? null : form.password,
});

export const validateAccount = (form: AccountForm) => {
  const errors: AccountErrors = {};
  if (!form.login.trim()) errors.login = "Введите логин";
  if (form.type === "local" && !form.password.trim())
    errors.password = "Введите пароль";
  return errors;
};

export const isAccountValid = (account: Account) =>
  !Object.keys(validateAccount(toForm(account))).length;
