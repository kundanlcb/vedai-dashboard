import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/store';
import { addToast, removeToast } from '@store/slices/notificationSlice';
import { useCallback } from 'react';

// ...existing code...

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const showSuccess = useCallback(
    (message: string, duration = 3000) => {
      const id = Math.random().toString();
      dispatch(
        addToast({
          message,
          type: 'success',
          duration,
        })
      );

      if (duration) {
        setTimeout(() => {
          dispatch(removeToast(id));
        }, duration);
      }

      return id;
    },
    [dispatch]
  );

  const showError = useCallback(
    (message: string, duration = 3000) => {
      const id = Math.random().toString();
      dispatch(
        addToast({
          message,
          type: 'error',
          duration,
        })
      );

      if (duration) {
        setTimeout(() => {
          dispatch(removeToast(id));
        }, duration);
      }

      return id;
    },
    [dispatch]
  );

  const showWarning = useCallback(
    (message: string, duration = 3000) => {
      const id = Math.random().toString();
      dispatch(
        addToast({
          message,
          type: 'warning',
          duration,
        })
      );

      if (duration) {
        setTimeout(() => {
          dispatch(removeToast(id));
        }, duration);
      }

      return id;
    },
    [dispatch]
  );

  const showInfo = useCallback(
    (message: string, duration = 3000) => {
      const id = Math.random().toString();
      dispatch(
        addToast({
          message,
          type: 'info',
          duration,
        })
      );

      if (duration) {
        setTimeout(() => {
          dispatch(removeToast(id));
        }, duration);
      }

      return id;
    },
    [dispatch]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useNotification;

