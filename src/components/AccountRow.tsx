import { useState } from "react";
import {
  Box,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import {
  ACCOUNT_TYPE_LABELS,
  MAX_CREDENTIAL_LENGTH,
  MAX_LABEL_LENGTH,
  toAccount,
  toForm,
  validateAccount,
  type Account,
  type AccountForm,
  type AccountErrors,
  type AccountType,
} from "../accounts";
import { useAccountsStore } from "../store";

export const AccountRow = ({
  account,
  position,
  autoFocus,
}: {
  account: Account;
  position: number;
  autoFocus: boolean;
}) => {
  const [form, setForm] = useState(() => toForm(account));
  const [errors, setErrors] = useState<AccountErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const updateAccount = useAccountsStore((state) => state.updateAccount);
  const removeAccount = useAccountsStore((state) => state.removeAccount);
  const baseId = `account-${account.id}`;

  const change = (field: "labels" | "login" | "password", value: string) => {
    setForm({ ...form, [field]: value });
  };

  const save = (values: AccountForm, field?: keyof AccountErrors) => {
    const validation = validateAccount(values);
    if (field)
      setErrors((previous) => ({ ...previous, [field]: validation[field] }));
    if (Object.keys(validation).length) return;
    updateAccount(toAccount(account.id, values));
  };

  return (
    <Box
      className="account-row"
      role="group"
      aria-label={`Учётная запись ${position}`}
    >
      <Box className="account-fields">
        <Box className="account-field labels-field">
          <FormLabel htmlFor={`${baseId}-labels`} className="field-label">
            Метки
          </FormLabel>
          <TextField
            id={`${baseId}-labels`}
            value={form.labels}
            multiline
            maxRows={2}
            placeholder="Например: работа; почта"
            autoFocus={autoFocus}
            onChange={(event) => change("labels", event.target.value)}
            onBlur={() => save(form)}
            slotProps={{
              htmlInput: {
                "aria-label": `Метки записи ${position}`,
                "aria-describedby": "labels-hint",
                maxLength: MAX_LABEL_LENGTH,
              },
            }}
          />
        </Box>
        <Box className="account-field type-field">
          <FormLabel id={`${baseId}-type-label`} className="field-label">
            Тип записи
          </FormLabel>
          <TextField
            select
            id={`${baseId}-type`}
            value={form.type}
            onChange={(event) => {
              const next = {
                ...form,
                type: event.target.value as AccountType,
                password: "",
              };
              setPasswordVisible(false);
              setErrors((previous) => ({ ...previous, password: undefined }));
              setForm(next);
              save(next);
            }}
            slotProps={{
              select: {
                labelId: `${baseId}-type-label`,
                MenuProps: {
                  slotProps: {
                    paper: { className: "type-menu" },
                  },
                },
              },
            }}
          >
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([type, label]) => (
              <MenuItem key={type} value={type}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className="credentials-fields">
          <Box className="account-field">
            <FormLabel htmlFor={`${baseId}-login`} className="field-label">
              Логин{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </FormLabel>
            <TextField
              id={`${baseId}-login`}
              value={form.login}
              placeholder="Введите логин"
              required
              error={!!errors.login}
              helperText={errors.login}
              autoComplete="off"
              onChange={(event) => change("login", event.target.value)}
              onBlur={() => save(form, "login")}
              slotProps={{
                htmlInput: {
                  "aria-label": `Логин записи ${position}`,
                  maxLength: MAX_CREDENTIAL_LENGTH,
                },
              }}
            />
          </Box>
          {form.type === "local" && (
            <Box className="account-field">
              <FormLabel htmlFor={`${baseId}-password`} className="field-label">
                Пароль{" "}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <TextField
                id={`${baseId}-password`}
                value={form.password}
                placeholder="Введите пароль"
                required
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password}
                onChange={(event) => change("password", event.target.value)}
                onBlur={() => save(form, "password")}
                slotProps={{
                  htmlInput: {
                    "aria-label": `Пароль записи ${position}`,
                    maxLength: MAX_CREDENTIAL_LENGTH,
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={`${passwordVisible ? "Скрыть" : "Показать"} пароль записи ${position}`}
                          aria-pressed={passwordVisible}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          edge="end"
                        >
                          {passwordVisible ? (
                            <VisibilityOffOutlined fontSize="small" />
                          ) : (
                            <VisibilityOutlined fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Tooltip title="Удалить запись">
        <IconButton
          className="delete-account"
          aria-label={`Удалить запись ${position}`}
          onClick={() => removeAccount(account.id)}
        >
          <DeleteOutlineRounded fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
