import bridge from '@vkontakte/vk-bridge';

/*
 * Обертка для VKWebAppSetSwipeSettings
 */
export default (history = true): void => {
  if (window.is_mobile && bridge.supports('VKWebAppSetSwipeSettings')) {
    bridge.send('VKWebAppSetSwipeSettings', { history });
  }
};
