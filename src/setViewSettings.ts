import bridge from '@vkontakte/vk-bridge';

import { ViewSettingsType } from './types/viewSettings';

export const defaultViewSettings: ViewSettingsType = {
  status_bar_style: 'dark',
  action_bar_color: 'white',
  navigation_bar_color: 'white',
};

/*
 * Wrapper for VKWebAppSetViewSettings. Sets mobile view settings.
 * Defaults are light status bar, white action bar, white navigation bar
 */
export default (viewSettings: ViewSettingsType = defaultViewSettings): void => {
  if (window.is_mobile && bridge.supports('VKWebAppSetViewSettings')) {
    bridge.send('VKWebAppSetViewSettings', viewSettings);
  }
};
