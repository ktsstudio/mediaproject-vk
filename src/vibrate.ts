import bridge from '@vkontakte/vk-bridge';

export enum VibrationImpactEnum {
  heavy = 'heavy',
  medium = 'medium',
  light = 'light',
}

// виброотклик на ошибку
export const vibrateAsImpact = (style: VibrationImpactEnum) => {
  if (bridge.supports('VKWebAppTapticImpactOccurred')) {
    bridge.send('VKWebAppTapticImpactOccurred', { style });
  }
};

export enum VibrationNotificationEnum {
  error = 'error',
  success = 'success',
  warning = 'warning',
}

// виброотклик на успешность выполнения действия
export const vibrateAsNotification = (type: VibrationNotificationEnum) => {
  if (bridge.supports('VKWebAppTapticNotificationOccurred')) {
    bridge.send('VKWebAppTapticNotificationOccurred', { type });
  }
};

// виброотклик на изменение выбора
export const vibrateAsSelection = () => {
  if (bridge.supports('VKWebAppTapticSelectionChanged')) {
    bridge.send('VKWebAppTapticSelectionChanged', {});
  }
};
