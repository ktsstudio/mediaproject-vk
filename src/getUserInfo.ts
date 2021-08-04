import bridge, { UserInfo } from '@vkontakte/vk-bridge';

export default async (): Promise<UserInfo | null> => {
  try {
    return await bridge.send('VKWebAppGetUserInfo');
  } catch (e) {
    return null;
  }
};
