import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { ResponseType } from './common';
import { GetAccessTokenParamsType } from './getAccessToken';

type VKApiRequestPropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type VKApiRequestMethodType = VKApiRequestPropsType['method'];

type VKApiRequestParamsType = VKApiRequestPropsType['params'];

type ApiParamsType = {
  method: VKApiRequestMethodType;
  params?: Omit<VKApiRequestParamsType, 'access_token' | 'v'>;
  version?: VKApiRequestParamsType['v'];
  accessToken?: VKApiRequestParamsType['access_token'] | null;
  getAccessTokenParams?: GetAccessTokenParamsType;
  renewTokenIfExpired?: boolean;
  renewTokenIfNoneProvided?: boolean;
};

type ApiResponseType = ResponseType<'VKWebAppCallAPIMethod'>;

export type {
  VKApiRequestPropsType,
  VKApiRequestMethodType,
  VKApiRequestParamsType,
  ApiParamsType,
  ApiResponseType,
};
