import {
  ErrorData,
  PersonalAuthScope,
  RequestPropsMap,
} from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';

export type GetVkAccessTokenPropsType = RequestPropsMap['VKWebAppGetAuthToken'];

export type GetNewVkAccessTokenParamsType = {
  scopes?: PersonalAuthScope[] | null;
  appId?: GetVkAccessTokenPropsType['app_id'];
};

export type GetVkAccessTokenParamsType = GetNewVkAccessTokenParamsType & {
  onUserDeniedAll?: (error?: ErrorData) => void;
  onUserDeniedSomeScopes?: () => void;
  onErrorOccurred?: (error?: ErrorData) => void;
};

export type GetNewVkAccessTokenResponseType =
  VkResponseType<'VKWebAppGetAuthToken'>;
