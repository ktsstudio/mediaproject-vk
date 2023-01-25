import bridge, { ErrorData, PersonalAuthScope } from '@vkontakte/vk-bridge';

import { checkVkUserDenied } from './checkVkUserDenied';
import {
  GetVkAccessTokenParamsType,
  GetNewVkAccessTokenParamsType,
  GetNewVkAccessTokenResponseType,
} from './types';

const ALLOWED_VK_SCOPES: PersonalAuthScope[] = [
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

const parseVkScopes = (scopes?: string): PersonalAuthScope[] => {
  try {
    return scopes
      ? (scopes.split(',') as PersonalAuthScope[]).filter(
          (scope) =>
            ALLOWED_VK_SCOPES.indexOf(scope as PersonalAuthScope) !== -1
        )
      : [];
  } catch (error) {
    return [];
  }
};

const checkVkScopesAreEqual = (
  firstScope: Set<PersonalAuthScope>,
  secondScope: Set<PersonalAuthScope>
): boolean =>
  [...firstScope].reduce<boolean>(
    (result, neededScope) => result && secondScope.has(neededScope),
    true
  );

/**
 * Метод получения нового access token без обращения к window
 **/
const getNewVkAccessToken = async ({
  scopes = null,
  appId = window.app_id,
}: GetNewVkAccessTokenParamsType): Promise<GetNewVkAccessTokenResponseType> => {
  try {
    /**
     * Храним scopes в Set,
     * чтобы не было дублей
     **/
    const neededScopesSet = new Set(scopes || []);

    return await bridge.send('VKWebAppGetAuthToken', {
      /**
       * Если нужен токен с пустым scope,
       * то будет так: [].join(',') === ''
       **/
      scope: [...neededScopesSet].join(','),
      app_id: appId,
    });
  } catch (error) {
    return error;
  }
};

/**
 * Метод получения нового access token
 * с получением имеющихся данных из window и сохранением туда новых, а так же
 * с проверкой, действительно ли все нужные доступы выдал юзер
 **/
const getVkAccessToken = async ({
  scopes,
  onUserDeniedAll,
  onUserDeniedSomeScopes,
  onErrorOccurred,
  ...rest
}: GetVkAccessTokenParamsType): Promise<string | null> => {
  const neededScopesSet = new Set(scopes || []);
  const availableScopesSet = new Set(parseVkScopes(window.scope));

  const requiredScopesAreAlreadyAvailable = checkVkScopesAreEqual(
    neededScopesSet,
    availableScopesSet
  );

  /**
   * Если у нас уже есть токен со всеми нужными scopes, то запрашивать новый токен не нужно
   **/
  if (requiredScopesAreAlreadyAvailable && window.access_token) {
    return window.access_token;
  }

  const allNeededScopesSet = new Set([
    ...neededScopesSet,
    ...availableScopesSet,
  ]);

  /** Запрашиваем новый токен и с прошлыми доступными scopes из window, и с новыми **/
  const data = await getNewVkAccessToken({
    ...rest,
    scopes: [...allNeededScopesSet],
  });

  /** Если получен ответ **/
  if (data.access_token) {
    const receivedScopesSet = new Set(parseVkScopes(data.scope));

    const allNeededScopesReceived = checkVkScopesAreEqual(
      neededScopesSet,
      receivedScopesSet
    );

    /** И выданы все нужные scopes **/
    if (allNeededScopesReceived) {
      /** Обновляем access token и scopes в window **/
      window.access_token = data.access_token;
      window.scope = [...receivedScopesSet].join(',');

      return window.access_token;
    }

    /** Иначе вызываем коллбэк о том, что юзер дал не все нужные права **/
    onUserDeniedSomeScopes?.();

    return null;
  }

  /**
   * Если просто юзер не дал прав и из-за этого произошла ошибка,
   * вызываем соответствующий callback
   **/
  if (checkVkUserDenied(data as ErrorData)) {
    onUserDeniedAll?.(data as ErrorData);

    return null;
  }

  /**
   * В остальных случаях считаем, что произошла неизвестная ошибка
   **/
  onErrorOccurred?.(data as ErrorData);

  return null;
};

export {
  ALLOWED_VK_SCOPES,
  parseVkScopes,
  checkVkScopesAreEqual,
  getNewVkAccessToken,
  getVkAccessToken,
};
