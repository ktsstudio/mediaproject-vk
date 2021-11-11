import bridge, { LinkShareResult } from '@vkontakte/vk-bridge';

/*
 * Обертка для VKWebAppShare.
 * @param {string} link Ссылка, которую нужно пошерить
 */
export default async (link: string): Promise<boolean> => {
  const { type }: LinkShareResult = await bridge.send('VKWebAppShare', {
    link,
  });

  return Boolean(type);
};
