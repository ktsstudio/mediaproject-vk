import bridge from '@vkontakte/vk-bridge';

/*
* Wrapper to VKWebAppAllowNotifications. Asks to allow notifications from app
* @returns {boolean} Returns true if success
*/
export default async (): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAllowNotifications');

  return Boolean(result);
};
