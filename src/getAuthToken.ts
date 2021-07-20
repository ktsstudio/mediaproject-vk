import bridge from '@vkontakte/vk-bridge';

export enum ScopesEnum {
  friends = 'friends', // доступ к списку друзей пользователя
  photos = 'photos', // доступ к фотографиям
  video = 'video', // доступ к видеозаписям
  stories = 'stories', // доступ к историям
  pages = 'pages', // доступ к wiki-страницам
  status = 'status', // доступ к статусу пользователя
  notes = 'notes', // доступ к заметкам пользователя
  wall = 'wall', // к методам работы со стеной
  docs = 'docs', // доступ к документам
  groups = 'groups', // доступ к сообществам пользователя
  stats = 'stats', // доступ к статистике групп и приложений пользователя, администратором которых он является
  market = 'market', // доступ к товарам
}

export type AuthTokenResponseType = {
  access_token: string;
  scope: string;
};

export default async (
  app_id: number,
  accessScope: ScopesEnum | ScopesEnum[]
): Promise<string | null> => {
  const scope = Array.isArray(accessScope)
    ? accessScope.join(', ')
    : accessScope;

  const response: AuthTokenResponseType = await bridge.send(
    'VKWebAppGetAuthToken',
    {
      app_id,
      scope,
    }
  );

  return response?.access_token || null;
};
