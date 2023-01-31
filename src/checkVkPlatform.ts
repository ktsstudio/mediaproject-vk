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
   * Приложение открыто в браузере мобильного устройства.
   */
  mvk: 'mvk',

  /**
   * Приложение открыто в браузере мобильного устройства на платформе IOS.
   */
  mvk_ios: 'mvk_ios',

  /**
   * Приложение открыто в браузере мобильного устройства на платформе Android.
   */
  mvk_android: 'mvk_android',
};

/**
 * Утилита для установки настроек под текущую платформу, на которой запущено приложение ВКонтакте.
 * В зависимости от платформы устанавливает нужные флаги в window и добавляет нужные класснеймы на тег body.
 *
 * Если приложение открыто на desktop (window.platform одна из {@link DESKTOP_VK_PLATFORMS}),
 * устанавливает window.is_mobile = false и добавляет класснейм 'desktop' на тег body.
 *
 * Если приложение открыто в мобильном приложении ВКонтакте на IOS (window.platform одна из {@link IOS_VK_PLATFORMS}),
 * устанавливает в true window.is_mobile и window.is_ios и добавляет класснеймы 'mobile ios'.
 *
 * Если приложение открыто в мобильном приложении ВКонтакте на Android (window.platform одна из {@link ANDROID_VK_PLATFORMS}),
 * устанавливает в true window.is_mobile и window.is_android и добавляет класснеймы 'mobile android'.
 *
 * Если приложение открыто в браузере на мобильном устройстве (m.vk),
 * устанавливает в true window.is_mobile и window.is_mvk = true и добавляет класснеймы 'mobile mvk'.
 * Также по регулярным выражениям для UserAgent проверяет, открыт ли m.vk на Android
 * (помимо предыдущих значений еще устанавливает в true window.is_android и добавляет класснейм 'mvk_android'),
 * или на IOS (помимо предыдущих значений еще устанавливает в true window.is_ios и добавляет класснейм 'mvk_ios').
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

  /**
   * Если обнаружили, что открыта десктопная версия,
   * дальнейших проверок на платформу не делаем
   */
  if (!isMobile) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.desktop);

    return;
  }

  window.is_mobile = true;
  document.body.classList.add(VK_PLATFORM_CLASSNAME.mobile);

  /**
   * Проверяем, открыты ли мобильное приложение или мобильный браузер на IOS
   */
  if (IOS_VK_PLATFORMS.includes(platform)) {
    window.is_ios = true;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);

    return;
  }

  /**
   * Проверяем, открыты ли мобильное приложение или мобильный браузер на Android
   */
  if (ANDROID_VK_PLATFORMS.includes(platform)) {
    window.is_android = true;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.android);

    return;
  }

  window.is_mvk = true;
  document.body.classList.add(VK_PLATFORM_CLASSNAME.mvk);

  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    window.is_ios;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.mvk_ios);

    return;
  }

  if (/android/i.test(navigator.userAgent)) {
    window.is_android;
    document.body.classList.add(VK_PLATFORM_CLASSNAME.mvk_android);

    return;
  }
};

export {
  DESKTOP_VK_PLATFORMS,
  IOS_VK_PLATFORMS,
  ANDROID_VK_PLATFORMS,
  VK_PLATFORM_CLASSNAME,
  checkVkPlatform,
};
