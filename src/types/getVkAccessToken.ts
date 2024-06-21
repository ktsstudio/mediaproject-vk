import { PersonalAuthScope, RequestPropsMap } from '@vkontakte/vk-bridge';

import { ErrorCallbacksType, VkResponseType } from './common';

export type GetVkAccessTokenPropsType = RequestPropsMap['VKWebAppGetAuthToken'];

export type GetNewVkAccessTokenParamsType = {
  scopes?: PersonalAuthScope[] | null;
  appId: GetVkAccessTokenPropsType['app_id'];
};

export type GetVkAccessTokenParamsType = GetNewVkAccessTokenParamsType &
  ErrorCallbacksType;

export type GetNewVkAccessTokenResponseType =
  VkResponseType<'VKWebAppGetAuthToken'>;
