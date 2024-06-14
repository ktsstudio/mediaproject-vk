import bridge, { ErrorData } from '@vkontakte/vk-bridge';

import { getVkAccessToken } from './getVkAccessToken';
import { isVkError } from './isVkError';
import { CallVkApiPropsType, CallVkApiResponseType } from './types';

/**
 * Ошибки от API ВКонтакте, в случае возникновения которых нужно обновить токен доступа.
 *
 * @constant {Set<string>}
 */
const VK_TOKEN_ERRORS = new Set([
  'User authorization failed: access_token was given to another ip address.',
  'User authorization failed: access_token has expired.',
]);

/**
 * Утилита для вызова метода API ВКонтакте.
 *
 * @param {CallVkApiPropsType} props Параметры для вызова метода API ВКонтакте.
 * @param {string} props.method Имя вызываемого {@link https://dev.vk.com/methods|метода API}.
 * @param {Object} [props.params={}] Параметры метода API, специфичные для указанного метода.
 * @param {string} [props.version='5.199'] Версия API, используемая для запроса. По умолчанию 5.199.
 * @param {string|null} [props.accessToken=null] Ключ доступа для обращения к API. Если не передан, будет получен вызовом функции {@link getVkAccessToken} с передчаей в нее параметров из getAccessTokenParams.
 * @param {string} [props.renewTokenIfExpired=true] Нужно ли получить новый токен доступа и повторить запрос в случае, если срок действия токена закончился. Если указан как true, то при получении от API ошибки одной из {@link VK_TOKEN_ERRORS} будет вызван метод {@link getNewVkAccessToken} с аргументом getAccessTokenParams.
 * @param {Object} [props.getAccessTokenParams] Параметры для получения токена доступа, которые будут переданы в {@link getVkAccessToken} в случае, если токена нет, или в {@link getNewVkAccessToken}, если срок действия токена закончился (если передано значение true для renewTokenIfExpired).
 * @returns {Promise<CallVkApiResponseType>} Возвращает ответ, полученный на запрос VKWebAppCallAPIMethod с переданными параметрами. Поле результата response, присутствующее в случае успешного запроса, может быть типизировано с помощью дженерика
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppCallAPIMethod|VKWebAppCallAPIMethod}
 */
// eslint-disable-next-line
const callVkApi = async <D = any>({
  method,
  params = {},
  version = '5.199',
  accessToken = null,
  renewTokenIfExpired = true,
  getAccessTokenParams,
}: CallVkApiPropsType): Promise<CallVkApiResponseType<D>> => {
  try {
    let token: string | null = accessToken;

    /**
     * Если access token нет,
     * получаем новый перед запросом к API
     */
    if (!accessToken) {
      token = await getVkAccessToken(getAccessTokenParams);
    }

    return await bridge.send('VKWebAppCallAPIMethod', {
      method,
      params: {
        v: version,

        /**
         * Если токен так и не получили, отправляем запрос без токена,
         * чтобы получить соответсвующую ошибку от API ВКонтакте
         */
        access_token: token || '',
        ...params,
      },
    });
  } catch (error) {
    if (!isVkError(error)) {
      return makeUnknownVkError(error);
    }

    const errorMessage = getVkErrorMessage(error);

    /**
     * Если срок действия токена доступа истек,
     * запрашиваем новый и повторяем запрос
     */
    if (
      renewTokenIfExpired &&
      errorMessage &&
      VK_TOKEN_ERRORS.has(errorMessage)
    ) {
      window.access_token = undefined;
      const newAccessToken = await getVkAccessToken(getAccessTokenParams);

      return await callVkApi({
        method,
        params,
        version,
        accessToken: newAccessToken,
        getAccessTokenParams,
        renewTokenIfExpired: false,
      });
    }

    return error;
  }
};

const getVkErrorMessage = (error: ErrorData) => {
  if (error.error_type === 'api_error') {
    return error.error_data.error_msg;
  }

  return error.error_data.error_reason;
};

const makeUnknownVkError = (error: unknown): ErrorData => {
  return {
    error_type: 'client_error',
    error_data: {
      error_code: -111_000_111,
      error_reason: 'unknown',
      error_description: toStringInfo(error),
    },
  };
};

const toStringInfo = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message;
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

export { VK_TOKEN_ERRORS, callVkApi };
