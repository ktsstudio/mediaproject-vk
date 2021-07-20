import bridge from '@vkontakte/vk-bridge';

export default async (): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAddToFavorites');

  return Boolean(result);
};
