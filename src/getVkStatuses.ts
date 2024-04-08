import { VkStatusesParamsType, VkApiStatusType } from './types';
import { callVkApi } from './callVkApi';

/**
 * Утилита для получения получение списка статусов, доступных приложению.
 *
 * @param {VkStatusesParamsType} props Параметры для получения списка статусов, доступных приложению.
 * @param {number} props.appId ID текущего приложения.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {VoidFunction} props.onUserDeniedAccess Коллбэк, вызываемый в случае, если пользователь не дал разрешение на получение прав доступа внутри {@link callVkApi}.
 * @param {VoidFunction} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @return {Promise<VkApiStatusType[]>} Возвращает список доступных статусов.
 *
 */
export default async ({
  accessToken = window.access_token,
  onUserDeniedAccess,
  appId,
  onErrorOccurred,
}: VkStatusesParamsType): Promise<VkApiStatusType[]> => {
  const result = await callVkApi({
    method: 'status.getImageList',
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

    return [];
  }

  return (result as any)?.response?.items || [];
};
