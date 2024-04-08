import { VkStatusesParamsType } from './types';
import { callVkApi } from './callVkApi';

/**
 * Утилита для получения текущего ID статуса пользователя.
 *
 * @param {VkStatusesParamsType} props Параметры для получения текущего ID статуса пользователя.
 * @param {number} props.appId ID текущего приложения.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {VoidFunction} props.onUserDeniedAccess Коллбэк, вызываемый в случае, если пользователь не дал разрешение на получение прав доступа внутри {@link callVkApi}.
 * @param {VoidFunction} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @return {Promise<any>} Возвращает ID текущего статуса пользователя или null.
 *
 */
export default async ({
  accessToken = window.access_token,
  onUserDeniedAccess,
  appId,
  onErrorOccurred,
}: VkStatusesParamsType): Promise<number | null> => {
  const result = await callVkApi({
    method: 'status.getImage',
    accessToken,
    getAccessTokenParams: {
      appId,
      scopes: ['status'],
      onUserDeniedAll: onUserDeniedAccess,
      onUserDeniedSomeScopes: onUserDeniedAccess,
    },
    renewTokenIfExpired: true,
  });

  if (result.error_type) {
    onErrorOccurred?.(result);

    return null;
  }

  return (result as any)?.response?.status?.id || null;
};
