import bridge from '@vkontakte/vk-bridge';

import { AuthTokenResponseType, ScopesEnum } from './types/token';

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
