import bridge, { ReceiveData } from '@vkontakte/vk-bridge';

/*
 * Обертка для VKWebAppCallAPIMethod.
 * Вызывает метод vk api версии 5.131.
 * @param {string} метод vk api
 * @param {string} access_token vk access token
 * @param params дополнительные параметры
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
