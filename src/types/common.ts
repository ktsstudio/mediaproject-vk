import {
  AnyReceiveMethodName,
  ErrorData,
  ReceiveData,
} from '@vkontakte/vk-bridge';

type ResponseType<M> = M extends AnyReceiveMethodName
  ? Partial<ReceiveData<M> & ErrorData>
  : void;

/*
 * https://dev.vk.com/mini-apps/development/launch-params#vk_platform
 */
type InternalPlatformType =
  | 'desktop_web'
  | 'mobile_android'
  | 'mobile_android_messenger'
  | 'mobile_ipad'
  | 'mobile_iphone'
  | 'mobile_iphone_messenger'
  | 'mobile_web';

type ExternalPlatformType =
  | 'android_external'
  | 'iphone_external'
  | 'ipad_external'
  | 'web_external'
  | 'mvk_external';

type PlatformType = InternalPlatformType | ExternalPlatformType;

export type {
  ResponseType,
  InternalPlatformType,
  ExternalPlatformType,
  PlatformType,
};
