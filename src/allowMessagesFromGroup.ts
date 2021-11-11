import bridge from '@vkontakte/vk-bridge';

/*
 * Обертка для метода VKWebAppAllowMessagesFromGroup. Запрашивает у юзера разрешение на получение сообщений от сообщества
 * @param {number} group_id ID группы VK. По умолчанию читается из window.group_id
 * @returns {boolean} true, если разрешение было получено
 */
export default async (group_id = Number(window.group_id)): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAllowMessagesFromGroup', {
    group_id,
  });

  return Boolean(result);
};
