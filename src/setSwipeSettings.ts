import bridge from '@vkontakte/vk-bridge';

export default (history = true): void => {
  if (bridge.supports('VKWebAppSetSwipeSettings')) {
    bridge.send('VKWebAppSetSwipeSettings', { history });
  }
};
