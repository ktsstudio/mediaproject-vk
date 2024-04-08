import { SetVkStatusParamsType } from './types';
import { callVkApi } from './callVkApi';

/**
 * Утилита для установки ID статуса пользователю.
 *
 * @param {SetVkStatusParamsType} props Параметры установки статуса.
 * @param {statusId} props.statusId ID статуса, если хотим снять статус, то установить statusId: 0.
 * @param {number} props.appId ID текущего приложения.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {VoidFunction} props.onUserDeniedAccess Коллбэк, вызываемый в случае, если пользователь не дал разрешение на получение прав доступа внутри {@link callVkApi}.
 * @param {VoidFunction} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @return {Promise<boolean>} Возвращает, успешно ли выполнился запрос.
 *
 */
export default async ({
  statusId,
  accessToken = window.access_token,
  onUserDeniedAccess,
  appId,
  onErrorOccurred,
}: SetVkStatusParamsType): Promise<boolean> => {
  const result = await callVkApi({
    method: 'status.setImage',
    params: {
      status_id: statusId,
    },
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

    return false;
  }

  return true;
};
