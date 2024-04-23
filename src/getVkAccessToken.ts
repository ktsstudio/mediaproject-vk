import bridge, { ErrorData, PersonalAuthScope } from '@vkontakte/vk-bridge';

import { checkVkUserDenied } from './checkVkUserDenied';
import {
  GetVkAccessTokenParamsType,
  GetNewVkAccessTokenParamsType,
  GetNewVkAccessTokenResponseType,
} from './types';

/**
 * Массив всех возможных scopes для доступа к данным пользователя.
 *
 * @constant {PersonalAuthScope[]}
 *
 * @see {@link https://dev.vk.com/reference/access-rights}
 */
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

/**
 * Утилита для вычленения массива scopes из строки.
 *
 * @param {string=} scopes Строка, в которой через запятую перечислены scope. Допускаются только значения из {@link ALLOWED_VK_SCOPES}.
 * @returns {PersonalAuthScope[]} Массив извлеченных scope. В случае ошибки возвращается пустой массив.
 */
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

/**
 * Утилита для проверки равенства двух множеств scopes.
 *
 * @param {Set<PersonalAuthScope>} firstScope Первое множество scopes.
 * @param {Set<PersonalAuthScope>,} secondScope Второе множество scopes.
 * @returns {boolean} Если все значения из первого множества встречаются во втором, возвращает true. Иначе возвращает false.
 */
const checkOneScopesSetIncludesAnother = (
  firstScope: Set<PersonalAuthScope>,
  secondScope: Set<PersonalAuthScope>
): boolean =>
  [...firstScope].reduce<boolean>(
    (result, scope) => result && secondScope.has(scope),
    true
  );

/**
 * Утилита для получения нового токена доступа без возможности того, что токен мог быть получен ранее.
 *
 * @param {GetNewVkAccessTokenParamsType} props
 * @param {PersonalAuthScope[] | null} [props.scopes=null] Массив необходимых scopes. Если не передан, будет получен токен с пустым scope.
 * @param {number=} props.appId ID текущего приложения.
 * @returns {Promise<GetNewVkAccessTokenResponseType>} Возвращает ответ, полученный на запрос VKWebAppGetAuthToken с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppGetAuthToken}
 */
const getNewVkAccessToken = async ({
  scopes = null,
  appId,
}: GetNewVkAccessTokenParamsType): Promise<GetNewVkAccessTokenResponseType> => {
  try {
    /**
     * Храним scopes в Set, чтобы не было дублей
     */
    const neededScopesSet = new Set(scopes || []);

    return await bridge.send('VKWebAppGetAuthToken', {
      /**
       * Если нужен токен с пустым scope, то будет так: [].join(',') === ''
       */
      scope: [...neededScopesSet].join(','),
      app_id: appId,
    });
  } catch (error) {
    return error as ErrorData;
  }
};

/**
 * Утилита для получения токена доступа.
 * Сохраняет новый токен в window.access_token и имеющиеся у него права доступа в window.scope.
 * Если ранее токен с требуемыми правами доступа (scopes) уже был получен, будет взят токен из window.access_token.
 *
 * @param {GetVkAccessTokenParamsType} props
 * @param {PersonalAuthScope[] | null} [props.scopes=null] Массив необходимых scopes. Объединяется с уже имеющимися правами доступа в window.scope.
 * @param {(error?: ErrorData) => void=} props.onUserDeniedAll Коллбэк, вызываемый в случае, если пользователь отказался давать доступ к запрашиваемым scopes.
 * @param {() => void=} props.onUserDeniedSomeScopes Коллбэк, вызываемый в случае, если пользователь дал доступ не ко всем требуемым scopes.
 * @param {(error?: ErrorData) => void=} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @param {number=} props.appId ID текущего приложения.
 * @returns {Promise<string | null>} В случае успеха возвращает токен доступа. Иначе возвращает null.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppGetAuthToken}
 */
const getVkAccessToken = async ({
  scopes,
  onUserDeniedAll,
  onUserDeniedSomeScopes,
  onErrorOccurred,
  appId,
}: GetVkAccessTokenParamsType): Promise<string | null> => {
  const neededScopesSet = new Set(scopes || []);
  const availableScopesSet = new Set(parseVkScopes(window.scope));

  const requiredScopesAreAlreadyAvailable = checkOneScopesSetIncludesAnother(
    neededScopesSet,
    availableScopesSet
  );

  /**
   * Если у нас уже есть токен со всеми нужными scopes, то запрашивать новый токен не нужно
   */
  if (requiredScopesAreAlreadyAvailable && window.access_token) {
    return window.access_token;
  }

  const allNeededScopesSet = new Set([
    ...neededScopesSet,
    ...availableScopesSet,
  ]);

  /** Запрашиваем новый токен и с прошлыми доступными scopes из window, и с новыми */
  const data = await getNewVkAccessToken({
    scopes: [...allNeededScopesSet],
    appId,
  });

  /** Если получен ответ */
  if (data.access_token) {
    const receivedScopesSet = new Set(parseVkScopes(data.scope));

    const allNeededScopesReceived = checkOneScopesSetIncludesAnother(
      neededScopesSet,
      receivedScopesSet
    );

    /** И выданы все нужные scopes */
    if (allNeededScopesReceived) {
      /** Обновляем access token и scopes в window */
      window.access_token = data.access_token;
      window.scope = [...receivedScopesSet].join(',');

      return window.access_token;
    }

    /** Иначе вызываем коллбэк о том, что юзер дал не все нужные права */
    onUserDeniedSomeScopes?.();

    return null;
  }

  /**
   * Если просто юзер не дал прав и из-за этого произошла ошибка,
   * вызываем соответствующий callback
   */
  if (checkVkUserDenied(data as ErrorData)) {
    onUserDeniedAll?.(data as ErrorData);

    return null;
  }

  /**
   * В остальных случаях считаем, что произошла неизвестная ошибка
   */
  onErrorOccurred?.(data as ErrorData);

  return null;
};

export {
  ALLOWED_VK_SCOPES,
  parseVkScopes,
  checkOneScopesSetIncludesAnother,
  getNewVkAccessToken,
  getVkAccessToken,
};
