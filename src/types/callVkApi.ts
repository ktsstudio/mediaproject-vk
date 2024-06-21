import { ErrorData, RequestPropsMap } from '@vkontakte/vk-bridge';

import { GetVkAccessTokenParamsType } from './getVkAccessToken';

type CallVkApiRequestBasePropsType = RequestPropsMap['VKWebAppCallAPIMethod'];

type CallVkApiPropsType = {
  method: CallVkApiRequestBasePropsType['method'];
  params?: Omit<CallVkApiRequestBasePropsType['params'], 'access_token' | 'v'>;
  version?: CallVkApiRequestBasePropsType['params']['v'];
  accessToken?: CallVkApiRequestBasePropsType['params']['access_token'] | null;
  renewTokenIfExpired?: boolean;
  getAccessTokenParams: GetVkAccessTokenParamsType;
};

type CallVkApiResponseType<D = unknown> = Partial<
  {
    response: D;
  } & ErrorData
>;

export type {
  CallVkApiRequestBasePropsType,
  CallVkApiPropsType,
  CallVkApiResponseType,
};
