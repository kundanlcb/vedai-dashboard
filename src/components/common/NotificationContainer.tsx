import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { selectToasts } from '@store/selectors/notificationSelectors';
import { removeToast } from '@store/slices/notificationSlice';
import type { AppDispatch } from '@store/store';

export const NotificationContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toasts = useSelector(selectToasts);

  const handleClose = (id: string) => {
    dispatch(removeToast(id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration || 3000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.type}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationContainer;

