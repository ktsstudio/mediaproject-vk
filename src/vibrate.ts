import bridge from '@vkontakte/vk-bridge';

import {
  VibrationImpactEnum,
  VibrationNotificationEnum,
} from './types/vabrations';

/**
 * Обертка для VKWebAppTapticImpactOccurred. Имитация виброотклика на ошибку.
 * @param {VibrationImpactEnum} style Одна из трех степеней силы вибрации
 */
export const vibrateAsImpact = (style: VibrationImpactEnum): void => {
  if (bridge.supports('VKWebAppTapticImpactOccurred')) {
    bridge.send('VKWebAppTapticImpactOccurred', { style });
  }
};

/**
 * Обертка для VKWebAppTapticNotificationOccurred. Имитация виброотклика на какое-либо действия.
 * @param {VibrationNotificationEnum} type Тип вибрации в зависимости от действия - ошибка, ворнинг или успех
 */
export const vibrateAsNotification = (
  type: VibrationNotificationEnum
): void => {
  if (bridge.supports('VKWebAppTapticNotificationOccurred')) {
    bridge.send('VKWebAppTapticNotificationOccurred', { type });
  }
};

/**
 * Обертка для VKWebAppTapticSelectionChanged. Имитация виброотклика выбора
 */
export const vibrateAsSelection = (): void => {
  if (bridge.supports('VKWebAppTapticSelectionChanged')) {
    bridge.send('VKWebAppTapticSelectionChanged', {});
  }
};
