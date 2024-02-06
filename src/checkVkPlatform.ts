import { DeviceInfo, VkPlatformType } from './types';

/**
 * Платформы ВКонтакте, для которых можно считать, что приложение открыто на десктопе.
 *
 * @constant {VkPlatformType[]}
 */
const DESKTOP_VK_PLATFORMS: VkPlatformType[] = [
  'desktop_web',
  'web_external',
  'desktop_app_messenger',
  'desktop_web_messenger',
];

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
  'mobile_android',
  'mobile_android_messenger',
  'android_external',
];

/**
 * Платформы ВКонтакте, для которых можно считать, что приложение открыто в мессенджере
 * в рамках одной из платформ: нативный Android, нативный iOS, нативный прил для десктопа
 * или веб-версия ВК Месседжера
 *
 * @constant {VkPlatformType[]}
 */
const MESSENGER_VK_PLATFORMS: VkPlatformType[] = [
  'mobile_android_messenger',
  'mobile_iphone_messenger',
  'desktop_web_messenger',
  'desktop_app_messenger',
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
   * указывающий, с какой именно мобильной платформы:
   * ios, android или web (m.vk.com или web.vk.me).
   */
  mobile: 'mobile',

  /**
   * Приложение открыто с мобильного устройства или с мобильного браузера на платформе IOS.
   */
  ios: 'ios',

  /**
   * Приложение открыто с мобильного устройства или с мобильного браузера на платформе Android.
   */
  android: 'android',

  /**
   * Приложение открыто в браузере (m.vk.com или web.vk.me), то есть это браузер,
   * который может быть открыт как на мобильном устройстве, так и на десктопе
   */
  web: 'web',
};

/**
 * Утилита для вычисления информации о текущей платформе, на которой запущено приложение ВКонтакте.
 * В зависимости от платформы возвращает нужные параметры и добавляет нужные класснеймы на тег body.
 *
 * Если приложение открыто на desktop (vk_platform одна из {@link DESKTOP_VK_PLATFORMS}),
 * устанавливает isMobile в false и добавляет класснейм 'desktop' на тег body.
 *
 * Если приложение открыто в мобильном приложении ВКонтакте на IOS (vk_platform одна из {@link IOS_VK_PLATFORMS}),
 * устанавливает в true isMobile и isIos и добавляет класснеймы 'mobile ios'.
 *
 * Если приложение открыто в мобильном приложении ВКонтакте на Android (vk_platform одна из {@link ANDROID_VK_PLATFORMS}),
 * устанавливает в true isMobile и isAndroid и добавляет класснеймы 'mobile android'.
 *
 * Если приложение открыто в браузере на мобильном устройстве (m.vk.com или web.vk.me),
 * устанавливает в true isMobile и isMvk = true и добавляет класснеймы 'mobile web'.
 * Также по регулярным выражениям для UserAgent проверяет, открыт ли m.vk.com (или web.vk.me) на Android
 * (помимо предыдущих значений еще устанавливает в true isAndroid и добавляет класснейм 'android',
 * или на IOS устанавливает в true isIos и добавляет класснейм 'ios').
 *
 * Возможные варианты сочетаний:
 * - desktop - браузер или нативный мессенджер на компьютере
 * - desktop web - веб-мессенджер на компьютере
 * - mobile ios - нативное мобильное приложение ВКонтакте или Мессенджер на платформе IOS
 * - mobile android - нативное мобильное приложение ВКонтакте или Мессенджер на платформе Android
 * - mobile web - мобильный браузер на неизвестной платформе (например, m.vk.com открыт с браузера компьютера)
 * - mobile web ios - мобильный браузер на платформе IOS (m.vk.com или web.vk.me в мобильном браузере на IOS)
 * - mobile web android - мобильный браузер на платформе Android (m.vk.com или web.vk.me в мобильном браузере на Android)
 *
 * @param {VkPlatformType | undefined} [platform] Значение текущей платформы, полученное в параметрах запуска ВКонтакте
 *
 * @see https://dev.vk.com/mini-apps/development/launch-params#vk_platform
 */

const checkVkPlatform = (
  platform: VkPlatformType | undefined
): DeviceInfo | null => {
  if (!platform) {
    return null;
  }

  const isMessenger = MESSENGER_VK_PLATFORMS.includes(platform);

  const isMobile = Boolean(
    platform && !DESKTOP_VK_PLATFORMS.includes(platform)
  );

  /**
   * Если обнаружили, что открыта десктопная версия,
   * дальнейших проверок на платформу не делаем
   */
  if (!isMobile) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.desktop);

    return {
      isMobile: false,
      isIos: false,
      isAndroid: false,
      isWeb: platform === 'desktop_web_messenger',
      isMessenger,
    };
  }

  document.body.classList.add(VK_PLATFORM_CLASSNAME.mobile);

  /**
   * Проверяем, открыты ли мобильное приложение (ВК или Мессенджер)
   * или мобильный браузер на IOS
   */
  if (IOS_VK_PLATFORMS.includes(platform)) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);

    return {
      isMobile: true,
      isIos: true,
      isAndroid: false,
      isWeb: false,
      isMessenger,
    };
  }

  /**
   * Проверяем, открыты ли мобильное приложение (ВК или Мессенджер)
   * или мобильный браузер на Android
   */
  if (ANDROID_VK_PLATFORMS.includes(platform)) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.android);

    return {
      isMobile: true,
      isIos: false,
      isAndroid: true,
      isWeb: false,
      isMessenger,
    };
  }

  document.body.classList.add(VK_PLATFORM_CLASSNAME.web);

  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);

    return {
      isMobile: true,
      isIos: true,
      isAndroid: false,
      isWeb: true,
      isMessenger,
    };
  }

  if (/android/i.test(navigator.userAgent)) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.android);

    return {
      isMobile: true,
      isIos: false,
      isAndroid: true,
      isWeb: true,
      isMessenger,
    };
  }

  return {
    isMobile: true,
    isIos: false,
    isAndroid: false,
    isWeb: true,
    isMessenger,
  };
};

export {
  DESKTOP_VK_PLATFORMS,
  IOS_VK_PLATFORMS,
  ANDROID_VK_PLATFORMS,
  VK_PLATFORM_CLASSNAME,
  checkVkPlatform,
};
