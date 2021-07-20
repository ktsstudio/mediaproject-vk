import bridge, { LinkShareResult } from '@vkontakte/vk-bridge';

export default async (link: string): Promise<boolean> => {
  const { type }: LinkShareResult = await bridge.send('VKWebAppShare', {
    link,
  });

  return Boolean(type);
};
