import bridge, {
  ErrorData,
  ErrorDataAPIError,
  ErrorDataAuthError,
  ErrorDataClientError,
} from '@vkontakte/vk-bridge';

import { getVkAccessToken } from './getVkAccessToken';
import { CallVkApiPropsType, CallVkApiResponseType } from './types';

/**
 * Ошибки от API ВКонтакте, в случае возникновения которых нужно обновить токен доступа.
 *
 * @constant {string[]}
 */
const VK_TOKEN_ERRORS = [
  'User authorization failed: access_token was given to another ip address.',
  'User authorization failed: access_token has expired.',
];

/**
 * Утилита для вызова метода API ВКонтакте.
 *
 * @param {CallVkApiPropsType} props Параметры для вызова метода API ВКонтакте.
 * @param {string} props.method Имя вызываемого {@link https://dev.vk.com/methods|метода API}.
 * @param {Object} [props.params={}] Параметры метода API, специфичные для указанного метода.
 * @param {string} [props.version='5.131'] Версия API, используемая для запроса. По умолчанию 5.131.
 * @param {string|null} [props.accessToken=null] Ключ доступа для обращения к API. Если не передан, будет получен вызовом функции {@link getVkAccessToken} с передчаей в нее параметров из getAccessTokenParams.
 * @param {string} [props.renewTokenIfExpired=true] Нужно ли получить новый токен доступа и повторить запрос в случае, если срок действия токена закончился. Если указан как true, то при получении от API ошибки одной из {@link VK_TOKEN_ERRORS} будет вызван метод {@link getNewVkAccessToken} с аргументом getAccessTokenParams.
 * @param {Object} [props.getAccessTokenParams={}] Параметры для получения токена доступа, которые будут переданы в {@link getVkAccessToken} в случае, если токена нет, или в {@link getNewVkAccessToken}, если срок действия токена закончился (если передано значение true для renewTokenIfExpired).
 * @returns {Promise<CallVkApiResponseType>} Возвращает ответ, полученный на запрос VKWebAppCallAPIMethod с переданными параметрами.
 *
 * @see {@link https://dev.vk.com/bridge/VKWebAppCallAPIMethod|VKWebAppCallAPIMethod}
 */
const callVkApi = async ({
  method,
  params = {},
  version = '5.131',
  accessToken = null,
  renewTokenIfExpired = true,
  getAccessTokenParams = {},
}: CallVkApiPropsType): Promise<CallVkApiResponseType> => {
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
    const errorData = error as ErrorData;

    if (errorData.error_type) {
      /**
       * error?.error_data?.error_reason - на вебе
       * error?.error_data - на мобильных устройствах
       */
      const errorMessage =
        (
          (errorData.error_data as ErrorDataClientError | ErrorDataAuthError)
            ?.error_reason as any
        )?.error_msg || (errorData.error_data as ErrorDataAPIError)?.error_msg;

      /**
       * Если срок действия токена доступа истек,
       * запрашиваем новый и повторяем запрос
       */
      if (
        renewTokenIfExpired &&
        errorMessage &&
        VK_TOKEN_ERRORS.includes(errorMessage)
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
    }

    return errorData;
  }
};

export { VK_TOKEN_ERRORS, callVkApi };
