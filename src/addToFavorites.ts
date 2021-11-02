import bridge from '@vkontakte/vk-bridge';

/**
 * Wrapper to VKWebAppAddToFavorites. Adds app tp favourites
 * @returns {boolean} Returns true if success
 */
export default async (): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAddToFavorites');

  return Boolean(result);
};
