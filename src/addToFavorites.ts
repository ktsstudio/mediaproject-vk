import bridge from '@vkontakte/vk-bridge';

/*
* Обертка для метода VKWebAppAddToFavorites. Добавляет приложение в список избранных
* @returns {boolean} true, если приложение было добавлено
*/
export default async (): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAddToFavorites');

  return Boolean(result);
};
