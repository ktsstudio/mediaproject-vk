import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';
import { GetVkAccessTokenParamsType } from './getVkAccessToken';

type CallVkApiRequestPropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type CallVkApiRequestMethodType = CallVkApiRequestPropsType['method'];

type CallVkApiRequestParamsType = CallVkApiRequestPropsType['params'];

type CallVkApiParamsType = {
  method: CallVkApiRequestMethodType;
  params?: Omit<CallVkApiRequestParamsType, 'access_token' | 'v'>;
  version?: CallVkApiRequestParamsType['v'];
  accessToken?: CallVkApiRequestParamsType['access_token'] | null;
  renewTokenIfNoneProvided?: boolean;
} & (
  | {
      getAccessTokenParams?: GetVkAccessTokenParamsType;
      renewTokenIfExpired: false;
    }
  | {
      getAccessTokenParams: GetVkAccessTokenParamsType;
      renewTokenIfExpired: true;
    }
);

type CallVkApiResponseType = VkResponseType<'VKWebAppCallAPIMethod'>;

export type {
  CallVkApiRequestPropsType,
  CallVkApiRequestMethodType,
  CallVkApiRequestParamsType,
  CallVkApiParamsType,
  CallVkApiResponseType,
};
