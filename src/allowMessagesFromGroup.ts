import bridge from '@vkontakte/vk-bridge';

export default async (group_id: number): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAllowMessagesFromGroup', {
    group_id,
  });

  return Boolean(result);
};
