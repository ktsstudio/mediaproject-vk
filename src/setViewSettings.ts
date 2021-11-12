import bridge from '@vkontakte/vk-bridge';

import { ViewSettingsType } from './types/viewSettings';

export const defaultViewSettings: ViewSettingsType = {
  status_bar_style: 'dark',
  action_bar_color: 'white',
  navigation_bar_color: 'white',
};

/**
 * Обертка для VKWebAppSetViewSettings.
 * Устанавливает цвета statusbar и actionbar (IOS и Android), navigationbar (Android).
 * По умолчанию устанавливает темный цвет содержимого статус-бара (status_bar_style: 'dark') и белый фон (action_bar_color: 'white'),
 * а так же белый цвет навигационного меню (navigation_bar_color: 'white').
 * @param {ViewSettingsType} viewSettings Цветовые настройки statusbar, actionbar, navigationbar
 */
export default (viewSettings: ViewSettingsType = defaultViewSettings): void => {
  if (window.is_mobile && bridge.supports('VKWebAppSetViewSettings')) {
    bridge.send('VKWebAppSetViewSettings', viewSettings);
  }
};
