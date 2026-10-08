import { useState } from "react";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import { AccountRow } from "./components/AccountRow";
import { useAccountsStore } from "./store";

export const App = () => {
  const accounts = useAccountsStore((state) => state.accounts);
  const addAccount = useAccountsStore((state) => state.addAccount);
  const storageError = useAccountsStore((state) => state.storageError);
  const [focusId, setFocusId] = useState("");

  return (
    <Container component="main" maxWidth="lg" className="main-content">
      <Box className="page-heading">
        <Typography component="h1" variant="h1">
          Учётные записи
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => setFocusId(addAccount())}
        >
          Добавить запись
        </Button>
      </Box>
      <Box className="accounts-panel">
        <Box className="labels-hint" id="labels-hint">
          <HelpOutlineRounded />
          <Typography variant="body2">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
          </Typography>
        </Box>
        {storageError && (
          <Alert severity="error">
            Не удалось сохранить данные в браузере.
          </Alert>
        )}
        {accounts.length ? (
          <>
            <Box className="column-headings" aria-hidden="true">
              <Box className="account-fields">
                <span className="labels-field">Метки</span>
                <span className="type-field">Тип записи</span>
                <Box className="credentials-fields">
                  <span className="credential-heading">
                    Логин <span className="required-mark">*</span>
                  </span>
                  <span className="credential-heading">
                    Пароль <span className="required-mark">*</span>
                  </span>
                </Box>
              </Box>
              <span className="actions-space" />
            </Box>
            {accounts.map((account, index) => (
              <AccountRow
                key={account.id}
                account={account}
                position={index + 1}
                autoFocus={account.id === focusId}
              />
            ))}
          </>
        ) : (
          <Typography color="text.secondary" className="empty-state">
            Нет учётных записей
          </Typography>
        )}
      </Box>
    </Container>
  );
};
