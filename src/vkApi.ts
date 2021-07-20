import bridge, { ReceiveData } from '@vkontakte/vk-bridge';

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
