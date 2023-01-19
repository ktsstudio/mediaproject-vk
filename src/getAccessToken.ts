import bridge, { ErrorData, PersonalAuthScope } from '@vkontakte/vk-bridge';

import {
  GetAccessTokenParamsType,
  GetNewAccessTokenParamsType,
  GetNewAccessTokenResponseType,
} from './types/getAccessToken';
import { checkUserDenied } from './checkUserDenied';

const ALLOWED_SCOPES: PersonalAuthScope[] = [
  'friends',
  'photos',
  'video',
  'stories',
  'pages',
  'status',
  'notes',
  'wall',
  'docs',
  'groups',
  'stats',
  'market',
];

const parseScopes = (scopes?: string): PersonalAuthScope[] => {
  try {
    return scopes
      ? (scopes.split(',') as PersonalAuthScope[]).filter(
          (scope) => ALLOWED_SCOPES.indexOf(scope as PersonalAuthScope) !== -1
        )
      : [];
  } catch (error) {
    return [];
  }
};

/*
 * Метод получения нового access token без обращения к window
 */
const getNewAccessToken = async ({
  scopes = null,
  appId = window.app_id,
}: GetNewAccessTokenParamsType): Promise<GetNewAccessTokenResponseType> => {
  try {
    /*
     * Храним scopes в Set,
     * чтобы не было дублей
     */
    const neededScopesSet = new Set(scopes || []);

    return await bridge.send('VKWebAppGetAuthToken', {
      /*
       * Если нужен токен с пустым scope,
       * то будет так: [].join(',') === ''
       */
      scope: [...neededScopesSet].join(','),
      app_id: appId,
    });
  } catch (error) {
    return error;
  }
};

/*
 * Метод получения нового access token
 * с получением имеющихся данных из window и сохранением туда новых, а так же
 * с проверкой, действительно ли все нужные доступы выдал юзер
 */
const getAccessToken = async ({
  scopes,
  onUserDeniedAll,
  onUserDeniedSomeScopes,
  onErrorOccurred,
  ...rest
}: GetAccessTokenParamsType): Promise<string | null> => {
  const neededScopesSet = new Set(scopes || []);
  const availableScopesSet = new Set(parseScopes(window.scope));

  const requiredScopesAreAlreadyAvailable = [...neededScopesSet].reduce(
    (result, neededScope) => result && availableScopesSet.has(neededScope),
    true
  );

  /*
   * Если у нас уже есть токен со всеми нужными scopes, то запрашивать новый токен не нужно
   */
  if (requiredScopesAreAlreadyAvailable && window.access_token) {
    return window.access_token;
  }

  const allNeededScopesSet = new Set([
    ...neededScopesSet,
    ...availableScopesSet,
  ]);

  /* Запрашиваем новый токен и с прошлыми доступными scopes из window, и с новыми */
  const data = await getNewAccessToken({
    ...rest,
    scopes: [...allNeededScopesSet],
  });

  /* Если получен ответ */
  if (data.access_token) {
    const receivedScopesSet = new Set(parseScopes(data.scope));

    const allNeededScopesReceived = [...neededScopesSet].reduce(
      (result, neededScope) => result && receivedScopesSet.has(neededScope),
      true
    );

    /* И выданы все нужные scopes */
    if (allNeededScopesReceived) {
      /* Обновляем access token и scopes в window */
      window.access_token = data.access_token;
      window.scope = [...receivedScopesSet].join(',');

      return window.access_token;
    }

    /* Иначе вызываем коллбэк о том, что юзер дал не все нужные права */
    onUserDeniedSomeScopes?.();

    return null;
  }

  /*
   * Если просто юзер не дал прав и из-за этого произошла ошибка,
   * вызываем соответствующий callback
   */
  if (checkUserDenied(data as ErrorData)) {
    onUserDeniedAll?.(data as ErrorData);

    return null;
  }

  /*
   * В остальных случаях считаем, что произошла неизвестная ошибка
   */
  onErrorOccurred?.(data as ErrorData);

  return null;
};

export { parseScopes, getNewAccessToken, getAccessToken };
