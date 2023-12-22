import bridge, { ErrorData } from '@vkontakte/vk-bridge';

import {
  VkPlatformType,
  SetViewSettingsPropsType,
  SetViewSettingsResponseType,
} from './types';

/**
 * Массив платформ, которые поддерживают view settings.
 *
 * @constant {VkPlatformType[]}
 */
const VK_PLATFORMS_WITH_VIEW_SETTINGS: VkPlatformType[] = [
  'mobile_iphone',
  'mobile_ipad',
  'mobile_android',
];

/**
 * Утилита для установки темы для значков в статус-баре и цвета статус-бара.
 *
 * @param {SetViewSettingsPropsType} viewSettings Настройки для статус-бара, экшен-бара, навигейшн-бара.
 * @param {light | dark} viewSettings.status_bar_style Тема для значков статус-бара. Возможные значения: light — светлая. dark — тёмная.
 * @param {string} viewSettings.action_bar_color Цвет экшен-бара в формате HEX-кода (#00ffff). Значение 'none' для прозрачного цвета. Только для Android.
 * @param {string} viewSettings.navigation_bar_color Цвет навигационного бара в формате HEX-кода (#00ffff). Только для Android.
 * @returns {Promise<SetViewSettingsResponseType>} Возвращает ответ, полученный на запрос VKWebAppSetViewSettings с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppSetViewSettings}
 */
const setVkViewSettings = async (
  platform: VkPlatformType,
  viewSettings: SetViewSettingsPropsType
): Promise<SetViewSettingsResponseType | undefined> => {
  try {
    let settingsForCurrentPlatform = { ...viewSettings };

    if (
      platform &&
      VK_PLATFORMS_WITH_VIEW_SETTINGS.includes(platform) &&
      bridge.supports('VKWebAppSetViewSettings')
    ) {
      /**
       * Все настройки поддерживаются только на android,
       * так что если платформа не android, то используем только цвет status bar
       */
      if (platform !== 'mobile_android') {
        settingsForCurrentPlatform = {
          status_bar_style: viewSettings.status_bar_style,
        };
      }

      return await bridge.send(
        'VKWebAppSetViewSettings',
        settingsForCurrentPlatform
      );
    }
  } catch (error) {
    return error as ErrorData;
  }
};

export { VK_PLATFORMS_WITH_VIEW_SETTINGS, setVkViewSettings };
