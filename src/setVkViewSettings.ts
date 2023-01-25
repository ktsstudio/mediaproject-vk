import bridge from '@vkontakte/vk-bridge';

import {
  VkPlatformType,
  SetViewSettingsPropsType,
  SetViewSettingsResponseType,
} from './types';

const DEFAULT_VK_VIEW_SETTINGS: SetViewSettingsPropsType = {
  status_bar_style: 'dark',
  action_bar_color: 'white',
  navigation_bar_color: 'white',
};

const VK_PLATFORMS_WITH_VIEW_SETTINGS: VkPlatformType[] = [
  'mobile_iphone',
  'mobile_ipad',
  'mobile_android',
];

const setVkViewSettings = async (
  viewSettings: SetViewSettingsPropsType = DEFAULT_VK_VIEW_SETTINGS
): Promise<SetViewSettingsResponseType | undefined> => {
  try {
    let settingsForCurrentPlatform = { ...viewSettings };

    if (
      window.platform &&
      VK_PLATFORMS_WITH_VIEW_SETTINGS.includes(window.platform) &&
      bridge.supports('VKWebAppSetViewSettings')
    ) {
      /**
       * Все настройки поддерживаются только на android,
       * так что если платформа не android, то используем только цвет status bar
       **/
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

export {
  DEFAULT_VK_VIEW_SETTINGS,
  VK_PLATFORMS_WITH_VIEW_SETTINGS,
  setVkViewSettings,
};
