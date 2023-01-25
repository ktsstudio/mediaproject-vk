import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';
import { GetVkAccessTokenParamsType } from './getVkAccessToken';

type CallApiRequestPropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type CallApiRequestMethodType = CallApiRequestPropsType['method'];

type CallApiRequestParamsType = CallApiRequestPropsType['params'];

type CallApiParamsType = {
  method: CallApiRequestMethodType;
  params?: Omit<CallApiRequestParamsType, 'access_token' | 'v'>;
  version?: CallApiRequestParamsType['v'];
  accessToken?: CallApiRequestParamsType['access_token'] | null;
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

type CallApiResponseType = VkResponseType<'VKWebAppCallAPIMethod'>;

export type {
  CallApiRequestPropsType,
  CallApiRequestMethodType,
  CallApiRequestParamsType,
  CallApiParamsType,
  CallApiResponseType,
};
