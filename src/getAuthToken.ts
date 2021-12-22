import bridge, { PersonalAuthScope } from '@vkontakte/vk-bridge';

/**
 * Получает access token с переданными параметрами access scope.
 * В случае успеха возвращает строку с токеном.
 * В случае ошибки возвращает false,
 * Возвращает true, если пользователь не дал разрешение (ошибка 'User denied') либо дал разрешение не на все скоупы
 * @param {number} app_id ID VK-приложения, которое запрашивает доступ
 * @param {PersonalAuthScope | PersonalAuthScope[]} accessScope параметры доступа access scope. То, к чему в результате будет доступ с запрашиваемым токеном (друзья, фото и т.д.)
 */
export default async (
  app_id: number,
  accessScope: PersonalAuthScope | PersonalAuthScope[]
): Promise<string | boolean> => {
  const scopesArray = Array.isArray(accessScope) ? accessScope : [accessScope];

  try {
    const { access_token, scope: responseScope } = await bridge.send(
      'VKWebAppGetAuthToken',
      {
        app_id,
        scope: scopesArray.join(','),
      }
    );

    // проверяем, что все скоупы получены
    // нужно для андроида, на котором для каждого скоупа появляется отдельная модалка
    // и в результате может вернуться частичный скоуп
    const result = scopesArray.reduce((result, scopeWord) => {
      if (responseScope.indexOf(scopeWord) === -1) {
        return false;
      }

      return result;
    }, true);

    return result ? access_token : true;
  } catch (e) {
    if (
      e.error_type === 'client_error' &&
      e.error_data?.error_reason === 'User denied'
    ) {
      return true;
    }

    // eslint-disable-next-line no-console
    console.log(e);
    return false;
  }
};
