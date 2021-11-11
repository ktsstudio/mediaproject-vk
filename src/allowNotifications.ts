import bridge from '@vkontakte/vk-bridge';

/*
* Обертка для VKWebAppAllowNotifications. Запрашивает у юзера разрешение на отправку уведомлений от приложения
* @returns {boolean} true, если разрешение было получено
*/
export default async (): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAllowNotifications');

  return Boolean(result);
};
