import bridge from '@vkontakte/vk-bridge';

import { AuthTokenResponseType, ScopesEnum } from './types/token';

/*
 * Получает access token с переданными параметрами access scope.
 * В случае успеха возвращает строку с токеном.
 * В случае ошибки возвращает false,
 * Возвращает true, если пользователь не дал разрешение (ошибка 'User denied')
 * @param {number} app_id ID VK-приложения, которое запрашивает доступ
 * @param {ScopesEnum | ScopesEnum[]} accessScope параметры доступа access scope. То, к чему в результате будет доступ с запрашиваемым токеном (друзья, фото и т.д)
 */
export default async (
  app_id: number,
  accessScope: ScopesEnum | ScopesEnum[]
): Promise<string | boolean> => {
  const scope = Array.isArray(accessScope)
    ? accessScope.join(', ')
    : accessScope;

  try {
    const response: AuthTokenResponseType = await bridge.send(
      'VKWebAppGetAuthToken',
      {
        app_id,
        scope,
      }
    );

    return response?.access_token || false;
  } catch (e) {
    if (
      e.error_type === 'client_error' &&
      e.error_data?.error_reason === 'User denied'
    ) {
      return true;
    }

    console.log(e);
    return false;
  }
};
