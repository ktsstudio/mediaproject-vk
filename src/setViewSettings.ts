import bridge, { AppearanceType } from '@vkontakte/vk-bridge';

export type ViewSettingsType = {
  status_bar_style: AppearanceType;
  /** Android only */
  action_bar_color?: 'none' | string;
  /** Android only */
  navigation_bar_color?: string;
};

export const defaultViewSettings: ViewSettingsType = {
  status_bar_style: 'light',
  action_bar_color: 'white',
  navigation_bar_color: 'white',
};

export default (viewSettings: ViewSettingsType = defaultViewSettings): void => {
  if (bridge.supports('VKWebAppSetViewSettings')) {
    bridge.send('VKWebAppSetViewSettings', viewSettings);
  }
};
