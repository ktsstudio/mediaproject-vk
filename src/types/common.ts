import {
  AnyReceiveMethodName,
  ErrorData,
  ReceiveData,
} from '@vkontakte/vk-bridge';

type VkResponseType<M> = M extends AnyReceiveMethodName
  ? Partial<ReceiveData<M> & ErrorData>
  : void;

/**
 * https://dev.vk.com/mini-apps/development/launch-params#vk_platform
 */
type InternalVkPlatformType =
  | 'desktop_web'
  | 'mobile_android'
  | 'mobile_android_messenger'
  | 'mobile_ipad'
  | 'mobile_iphone'
  | 'mobile_iphone_messenger'
  | 'mobile_web';

type ExternalVkPlatformType =
  | 'android_external'
  | 'iphone_external'
  | 'ipad_external'
  | 'web_external'
  | 'mvk_external';

type VkPlatformType = InternalVkPlatformType | ExternalVkPlatformType;

type DeviceInfo = {
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isMvk: boolean;
};

export type {
  VkResponseType,
  InternalVkPlatformType,
  ExternalVkPlatformType,
  VkPlatformType,
  DeviceInfo,
};
