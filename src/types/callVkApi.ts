import { RequestPropsMap } from '@vkontakte/vk-bridge';

import { VkResponseType } from './common';
import { GetVkAccessTokenParamsType } from './getVkAccessToken';

type CallVkApiRequestBasePropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type CallVkApiPropsType = {
  method: CallVkApiRequestBasePropsType['method'];
  params?: Omit<CallVkApiRequestBasePropsType['params'], 'access_token' | 'v'>;
  version?: CallVkApiRequestBasePropsType['params']['v'];
  accessToken?: CallVkApiRequestBasePropsType['params']['access_token'] | null;
} & (
  | {
      renewTokenIfExpired: false;
      getAccessTokenParams?: GetVkAccessTokenParamsType;
    }
  | {
      renewTokenIfExpired: true;
      getAccessTokenParams: GetVkAccessTokenParamsType;
    }
);

type CallVkApiResponseType = VkResponseType<'VKWebAppCallAPIMethod'>;

export type {
  CallVkApiRequestBasePropsType,
  CallVkApiPropsType,
  CallVkApiResponseType,
};
