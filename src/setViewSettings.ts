import bridge, { ErrorData, ReceiveData } from '@vkontakte/vk-bridge';

import { PlatformType } from './types/common';
import { ViewSettingsType } from './types/setViewSettings';

export const DEFAULT_VIEW_SETTINGS: ViewSettingsType = {
  status_bar_style: 'dark',
  action_bar_color: 'white',
  navigation_bar_color: 'white',
};

const PLATFORMS_WITH_VIEW_SETTINGS: PlatformType[] = [
  'mobile_iphone',
  'mobile_ipad',
  'mobile_android',
];

const setViewSettings = async (
  viewSettings: ViewSettingsType = DEFAULT_VIEW_SETTINGS
): Promise<ReceiveData<'VKWebAppSetViewSettings'> | ErrorData | void> => {
  try {
    let settingsForCurrentPlatform = { ...viewSettings };

    if (
      window.platform &&
      PLATFORMS_WITH_VIEW_SETTINGS.includes(window.platform) &&
      bridge.supports('VKWebAppSetViewSettings')
    ) {
      /*
       * Все настройки поддерживаются только на android,
       * так что если платформа не android, то используем только цвет status bar
       */
      if (window.platform !== 'mobile_android') {
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
    return error;
  }
};

export { setViewSettings };
