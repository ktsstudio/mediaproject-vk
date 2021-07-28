import bridge, { ReceiveData } from '@vkontakte/vk-bridge';

/*
 * Wrapper for VKWebAppCallAPIMethod.
 * Calls VK API methods. Uses version 5.131.
 * @param {string} method VK API method
 * @param {string} access_token VK access token
 * @param params Additional payload
 * @returns {Promise<ReceiveData<'VKWebAppCallAPIMethod'>}
 */
export default async (
  method: string,
  access_token: string,
  params = {}
): Promise<ReceiveData<'VKWebAppCallAPIMethod'> | { error: any }> => {
  try {
    return await bridge.send('VKWebAppCallAPIMethod', {
      method,
      params: { ...params, v: '5.131', access_token },
    });
  } catch (e) {
    return { error: e };
  }
};
