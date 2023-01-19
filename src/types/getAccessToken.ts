import {
  ErrorData,
  PersonalAuthScope,
  ReceiveData,
  RequestPropsMap,
} from '@vkontakte/vk-bridge';

export type VKGetTokenPropsType = RequestPropsMap['VKWebAppGetAuthToken'];

export type GetNewAccessTokenParamsType = {
  scopes?: PersonalAuthScope[] | null;
  appId?: VKGetTokenPropsType['app_id'];
};

export type GetAccessTokenParamsType = GetNewAccessTokenParamsType & {
  onUserDeniedAll?: (error?: ErrorData) => void;
  onUserDeniedSomeScopes?: () => void;
  onErrorOccurred?: (error?: ErrorData) => void;
};

export type GetNewAccessTokenResponseType = Partial<
  ReceiveData<'VKWebAppGetAuthToken'> & ErrorData
>;
