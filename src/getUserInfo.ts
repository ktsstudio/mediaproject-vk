import bridge, { UserInfo } from '@vkontakte/vk-bridge';

export default async (): Promise<UserInfo | void> =>
  await bridge.send('VKWebAppGetUserInfo');
