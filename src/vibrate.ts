import bridge from '@vkontakte/vk-bridge';

import {
  VibrationImpactEnum,
  VibrationNotificationEnum,
} from './types/vabrations';

/*
 * Wrapper for VKWebAppTapticImpactOccurred. Imitates error vibration.
 * @param {VibrationImpactEnum} style Vibration style
 */
export const vibrateAsImpact = (style: VibrationImpactEnum) => {
  if (bridge.supports('VKWebAppTapticImpactOccurred')) {
    bridge.send('VKWebAppTapticImpactOccurred', { style });
  }
};

/*
 * Wrapper for VKWebAppTapticNotificationOccurred. Imitates action success vibration.
 * @param {VibrationNotificationEnum} type Vibration type
 */
export const vibrateAsNotification = (type: VibrationNotificationEnum) => {
  if (bridge.supports('VKWebAppTapticNotificationOccurred')) {
    bridge.send('VKWebAppTapticNotificationOccurred', { type });
  }
};

/*
 * Wrapper for VKWebAppTapticSelectionChanged. Imitates selection change vibration.
 */
export const vibrateAsSelection = () => {
  if (bridge.supports('VKWebAppTapticSelectionChanged')) {
    bridge.send('VKWebAppTapticSelectionChanged', {});
  }
};
