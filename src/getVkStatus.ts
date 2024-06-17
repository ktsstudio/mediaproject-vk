import { ErrorData } from '@vkontakte/vk-bridge';

import { callVkApi } from './callVkApi';
import { VkStatusesParamsType } from './types';

/**
 * Утилита для получения текущего ID статуса пользователя.
 *
 * @param {VkStatusesParamsType} props Параметры для получения текущего ID статуса пользователя.
 * @param {number} props.appId ID текущего приложения.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {string} [props.renewTokenIfExpired=true] Нужно ли получить новый токен доступа и повторить запрос в случае, если срок действия токена закончился. Если указан как true, то при получении от API ошибки одной из {@link VK_TOKEN_ERRORS} будет вызван метод {@link getNewVkAccessToken} с аргументом getAccessTokenParams.
 * @param {(error?: ErrorData) => void=} props.onUserDeniedAll Коллбэк, вызываемый в случае, если пользователь отказался давать доступ к запрашиваемым scopes.
 * @param {() => void=} props.onUserDeniedSomeScopes Коллбэк, вызываемый в случае, если пользователь дал доступ не ко всем требуемым scopes.
 * @param {(error?: ErrorData) => void=} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @return {Promise<any>} Возвращает ID текущего статуса пользователя или null.
 *
 */
const getVkStatus = async ({
  appId,
  accessToken = window.access_token,
  renewTokenIfExpired = true,
  onUserDeniedAll,
  onUserDeniedSomeScopes,
  onErrorOccurred,
}: VkStatusesParamsType): Promise<number | null> => {
  const result = await callVkApi<{ status: { id: number } }>({
    method: 'status.getImage',
    accessToken,
    getAccessTokenParams: {
      appId,
      scopes: ['status'],
      onUserDeniedAll,
      onUserDeniedSomeScopes,
    },
    renewTokenIfExpired,
  });

  if (result.response) {
    return result.response.status.id || null;
  }

  onErrorOccurred?.(result as ErrorData);

  return null;
};

export { getVkStatus };
