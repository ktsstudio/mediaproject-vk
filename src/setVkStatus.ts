import { ErrorData } from '@vkontakte/vk-bridge';

import { callVkApi } from './callVkApi';
import { SetVkStatusParamsType } from './types';

/**
 * Утилита для установки ID статуса пользователю.
 *
 * @param {SetVkStatusParamsType} props Параметры установки статуса.
 * @param {statusId} props.statusId ID статуса, если хотим снять статус, то установить statusId: 0.
 * @param {number} props.appId ID текущего приложения.
 * @param {string} props.accessToken Токен доступа для обращения к API ВКонтакте (передается в {@link callVkApi}). По умолчанию берется из window.access_token.
 * @param {string} [props.renewTokenIfExpired=true] Нужно ли получить новый токен доступа и повторить запрос в случае, если срок действия токена закончился. Если указан как true, то при получении от API ошибки одной из {@link VK_TOKEN_ERRORS} будет вызван метод {@link getNewVkAccessToken} с аргументом getAccessTokenParams.
 * @param {(error?: ErrorData) => void=} props.onUserDeniedAll Коллбэк, вызываемый в случае, если пользователь отказался давать доступ к запрашиваемым scopes.
 * @param {() => void=} props.onUserDeniedSomeScopes Коллбэк, вызываемый в случае, если пользователь дал доступ не ко всем требуемым scopes.
 * @param {(error?: ErrorData) => void=} props.onErrorOccurred Коллбэк, вызываемый в случае, если произошла ошибка.
 * @return {Promise<boolean>} Возвращает, успешно ли выполнился запрос.
 *
 */
const setVkStatus = async ({
  appId,
  statusId,
  accessToken = window.access_token,
  renewTokenIfExpired = true,
  onUserDeniedAll,
  onUserDeniedSomeScopes,
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
      onUserDeniedAll,
      onUserDeniedSomeScopes,
    },
    renewTokenIfExpired,
  });

  if (result.response) {
    return true;
  }

  onErrorOccurred?.(result as ErrorData);

  return false;
};

export { setVkStatus };
