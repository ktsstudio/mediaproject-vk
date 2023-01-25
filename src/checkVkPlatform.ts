import { VkPlatformType } from './types';

const DESKTOP_VK_PLATFORMS: VkPlatformType[] = ['desktop_web', 'web_external'];

const IOS_VK_PLATFORMS: VkPlatformType[] = [
  'mobile_ipad',
  'mobile_iphone',
  'mobile_iphone_messenger',
  'iphone_external',
  'ipad_external',
];

const ANDROID_VK_PLATFORMS: VkPlatformType[] = [
  'mobile_ipad',
  'mobile_iphone',
  'mobile_iphone_messenger',
];

const VK_PLATFORM_CLASSNAME = {
  desktop: 'desktop',
  mobile: 'mobile',
  ios: 'ios',
  android: 'android',
  mvk: 'mvk',
};

/**
 * Метод для проверки, является ли мобильной платформа, на которой открыто vk-приложение.
 * Устанавливает window.is_mobile = true, если является,
 * и добавляет класс 'mobile' или 'desktop' на document.body в зависимости от результата проверки.
 **/
const checkVkPlatform = (
  platform: VkPlatformType | undefined = window.platform
): void => {
  if (!platform) {
    return;
  }

  const isMobile = Boolean(
    platform && !DESKTOP_VK_PLATFORMS.includes(platform)
  );

  if (!isMobile) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.desktop);

    return;
  }

  if (isMobile) {
    window.is_mobile = true;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.mobile);

    if (IOS_VK_PLATFORMS.includes(platform)) {
      window.is_ios = true;
      document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);

      return;
    }

    if (ANDROID_VK_PLATFORMS.includes(platform)) {
      window.is_android = true;
      document.body.classList.add(VK_PLATFORM_CLASSNAME.android);

      return;
    }

    window.is_mvk = true;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.mvk);
  }
};

export {
  DESKTOP_VK_PLATFORMS,
  IOS_VK_PLATFORMS,
  ANDROID_VK_PLATFORMS,
  VK_PLATFORM_CLASSNAME,
  checkVkPlatform,
};
