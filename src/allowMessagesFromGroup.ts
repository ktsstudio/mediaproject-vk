import bridge from '@vkontakte/vk-bridge';

/*
 * Wrapper to VKWebAppAllowMessagesFromGroup. Asks to allow messages from group
 * @param {number} group_id ID of VK group. Taken from Window by default
 * @returns {boolean} Returns true if success
 */
export default async (group_id = Number(window.group_id)): Promise<boolean> => {
  const { result } = await bridge.send('VKWebAppAllowMessagesFromGroup', {
    group_id,
  });

  return Boolean(result);
};
