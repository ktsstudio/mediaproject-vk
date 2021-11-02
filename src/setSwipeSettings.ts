import bridge from '@vkontakte/vk-bridge';

/**
 * Wrapper for VKWebAppSetSwipeSettings
 */
export default (history = true): void => {
  if (bridge.supports('VKWebAppSetSwipeSettings')) {
    bridge.send('VKWebAppSetSwipeSettings', { history });
  }
};
