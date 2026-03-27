import { Icon } from '@iconify/react';
import type { SnackbarKey } from 'notistack';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type ButtonCloseProps = {
  snackbarId: SnackbarKey;
};

const ButtonClose = ({ snackbarId }: ButtonCloseProps) => {
  return (
    <button
      onClick={() => closeSnackbar(snackbarId)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Icon icon="mdi:close" color="var(--color-text-inverted)" width={20} height={20} />
    </button>
  );
};

const renderAction = (snackbarId: SnackbarKey) => <ButtonClose snackbarId={snackbarId} />;

const AppSnackbarProvider = ({ children }: Props) => {
  return (
    <SnackbarProvider
      dense
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={renderAction}
    >
      {children}
    </SnackbarProvider>
  );
};

export default AppSnackbarProvider;
