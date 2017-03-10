import { actions } from 'redux-notifications';

const showNotification = (message, kind = 'info') => {
  const config = {
    kind,
    message,
    dismissAfter: 10000,
  };
  return actions.notifSend(config);
};

export const notifications = {
  info: (message) => showNotification(message, 'info'),
  danger: (message) => showNotification(message, 'danger'),
  success: (message) => showNotification(message, 'success'),
  warning: (message) => showNotification(message, 'warning')
};
