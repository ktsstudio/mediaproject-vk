import bridge from '@vkontakte/vk-bridge';

import { getVkAccessToken, getNewVkAccessToken } from './getVkAccessToken';
import { CallApiParamsType, CallApiResponseType } from './types';

const VK_TOKEN_ERRORS = [
  'User authorization failed: access_token was given to another ip address.',
  'User authorization failed: access_token has expired.',
];

/**
 * Обертка для VKWebAppCallAPIMethod.
 * Вызывает метод API VK.
 * По умолчанию использует версию 5.131 и берет access token из window
 **/
const callVkApi = async ({
  method,
  params = {},
  version = '5.131',
  accessToken = null,
  getAccessTokenParams = {},
  renewTokenIfNoneProvided = false,
  renewTokenIfExpired = true,
}: CallApiParamsType): Promise<CallApiResponseType> => {
  try {
    let token: string | null = accessToken;

    /**
     * Если access token нет,
     * получаем новый перед запросом к API
     **/
    if (renewTokenIfNoneProvided && !accessToken) {
      token = await getVkAccessToken(getAccessTokenParams);
    }

    return await bridge.send('VKWebAppCallAPIMethod', {
      method,
      params: {
        v: version,
        /**
         * Если токен так и не получили, засылаем запрос без токена, чтобы
         * получить соответсвующую ошибку от VK
         **/
        access_token: token || '',
        ...params,
      },
    });
  } catch (error) {
    if (error.error_type) {
      /**
       * error?.error_data?.error_reason - на вебе
       * error?.error_data - на мобильных устройствах
       **/
      const errorData = {
        code:
          error.error_data?.error_reason?.error_code ??
          error.error_data?.error_code,
        message:
          error.error_data?.error_reason?.error_msg ??
          error.error_data?.error_msg,
      };

      /**
       * Если access token истек,
       * то запрашиваем новый и повторяем запрос к API
       **/
      if (
        renewTokenIfExpired &&
        errorData.message &&
        VK_TOKEN_ERRORS.includes(errorData.message)
      ) {
        await getNewVkAccessToken(getAccessTokenParams);

        return await callVkApi({
          method,
          params,
          version,
          accessToken,
          getAccessTokenParams,
          renewTokenIfNoneProvided: false,
          renewTokenIfExpired: false,
        });
      }
    }

    return error;
  }
};

export { VK_TOKEN_ERRORS, callVkApi };
