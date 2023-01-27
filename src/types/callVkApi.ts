import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';
import { GetVkAccessTokenParamsType } from './getVkAccessToken';

type CallVkApiRequestBasePropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type CallVkApiAccessTokenPropsType =
  | {
      renewTokenIfExpired?: false;
      getAccessTokenParams?: GetVkAccessTokenParamsType;
    }
  | {
      renewTokenIfExpired?: true;
      getAccessTokenParams: GetVkAccessTokenParamsType;
    };

/** @typedef {{ method: string, params?: Object, version?: string; accessToken?: string | null; renewTokenIfExpired?: boolean; getAccessTokenParams?: Object }} CallVkApiPropsType */

/**
 * @typedef {Object} CallVkApiPropsType
 * @property {string} props.method Имя вызываемого {@link https://dev.vk.com/methods|метода API}.
 * @property {Object} props.params Параметры метода API, специфичные для указанного метода.
 * @property {string} props.version Версия API, используемая для запроса. По умолчанию 5.131.
 * @property {string} props.accessToken Ключ доступа для обращения к API. Если не передан, будет получен вызовом функции {@link getVkAccessToken} с передчаей в нее параметров из getAccessTokenParams.
 * @property {boolean} [props.renewTokenIfExpired=true] Нужно ли получить новый токен доступа и повторить запрос в случае, если срок действия токена закончился. Если указан как true, то при получении от API ошибки одной из {@link VK_TOKEN_ERRORS} будет вызван метод {@link getNewVkAccessToken} с аргументом getAccessTokenParams.
 * @property {} props.getAccessTokenParams Параметры для получения токена доступа, которые будут переданы в {@link getVkAccessToken} в случае, если токена нет, или в {@link getNewVkAccessToken}, если срок действия токена закончился (если передано значение true для renewTokenIfExpired).
 */
type CallVkApiPropsType = {
  method: CallVkApiRequestBasePropsType['method'];
  params?: Omit<CallVkApiRequestBasePropsType['params'], 'access_token' | 'v'>;
  version?: CallVkApiRequestBasePropsType['params']['v'];
  accessToken?: CallVkApiRequestBasePropsType['params']['access_token'] | null;
} & CallVkApiAccessTokenPropsType;

type CallVkApiResponseType = VkResponseType<'VKWebAppCallAPIMethod'>;

export type {
  CallVkApiRequestBasePropsType,
  CallVkApiPropsType,
  CallVkApiResponseType,
};
