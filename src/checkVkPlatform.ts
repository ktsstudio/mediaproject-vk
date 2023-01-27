import { VkPlatformType } from './types';

/**
 * Платформы ВКонтакте, для которых можно считать, что приложение открыто на десктопе.
 *
 * @constant {VkPlatformType[]}
 */
const DESKTOP_VK_PLATFORMS: VkPlatformType[] = ['desktop_web', 'web_external'];

/**
 * Платформы ВКонтакте, для которых можно считать, что приложение открыто на IOS.
 *
 * @constant {VkPlatformType[]}
 */
const IOS_VK_PLATFORMS: VkPlatformType[] = [
  'mobile_ipad',
  'mobile_iphone',
  'mobile_iphone_messenger',
  'iphone_external',
  'ipad_external',
];

/**
 * Платформы ВКонтакте, для которых можно считать, что приложение открыто на Android.
 *
 * @constant {VkPlatformType[]}
 */
const ANDROID_VK_PLATFORMS: VkPlatformType[] = [
  'mobile_ipad',
  'mobile_iphone',
  'mobile_iphone_messenger',
];

/**
 * Класснеймы, которые могут добавляться тегу body после проверки текущей платформы ВКонтакте.
 *
 * @const {Record<string, string>}
 */
const VK_PLATFORM_CLASSNAME = {
  /**
   * Приложение открыто НЕ с мобильного устройства.
   */
  desktop: 'desktop',

  /**
   * Приложение открыто с какого-то мобильного устройства.
   * После этого класснейма так же должен добавиться класснейм,
   * указывающий, с какой именно мобильной платформы - ios, android или mvk.
   */
  mobile: 'mobile',

  /**
   * Приложение открыто с мобильного устройства на платформе IOS.
   */
  ios: 'ios',

  /**
   * Приложение открыто с мобильного устройства на платформе Android.
   */
  android: 'android',

  /**
   * Приложение открыто с мобильного устройства на платформе m.vk (в мобильном браузере).
   */
  mvk: 'mvk',
};

/**
 * Утилита для установки настроек под текущую платформу, на которой запущено приложение ВКонтакте.
 * В зависимости от платформы устанавливает нужный флаг в window и добавляет нужный класснейм на тег body.
 *
 * Если текущая платформа desktop (одна из {@link DESKTOP_VK_PLATFORMS}), устанавливает window.is_mobile = false и добавляет класснейм 'desktop' на тег body.
 *
 * Если текущая платформа IOS (одна из {@link IOS_VK_PLATFORMS}), устанавливает window.is_ios = true и добавляет класснеймы 'mobile ios'.
 *
 * Если текущая платформа Android (одна из {@link ANDROID_VK_PLATFORMS}), устанавливает window.is_android = true и добавляет класснеймы 'mobile android'.
 *
 * Если текущая платформа m.vk, устанавливает window.is_mvk = true и добавляет класснеймы 'mobile mvk'.
 *

 * @param {VkPlatformType | undefined} [platform=window.platform] Значение текущей платформы, полученное в параметрах запуска ВКонтакте
 *
 * @see https://dev.vk.com/mini-apps/development/launch-params#vk_platform
 */
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
