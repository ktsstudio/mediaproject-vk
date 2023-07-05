import { ErrorData, RequestPropsMap } from '@vkontakte/vk-bridge';

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

type CallVkApiPropsType = {
  method: CallVkApiRequestBasePropsType['method'];
  params?: Omit<CallVkApiRequestBasePropsType['params'], 'access_token' | 'v'>;
  version?: CallVkApiRequestBasePropsType['params']['v'];
  accessToken?: CallVkApiRequestBasePropsType['params']['access_token'] | null;
} & CallVkApiAccessTokenPropsType;

type CallVkApiResponseType<D> = Partial<
  {
    response: D;
  } & ErrorData
>;

export type {
  CallVkApiRequestBasePropsType,
  CallVkApiPropsType,
  CallVkApiResponseType,
};
