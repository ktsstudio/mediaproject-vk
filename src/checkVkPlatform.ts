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

const isAndroidUserAgent = () => /android/i.test(navigator.userAgent);
const isIosUserAgent = () => /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

// Todo: В mediaproject-utils в функции checkMobile разделить установку класса в body
//  и логику проверки userAgent. Заменить использование этой функции на утилиту из либы
const isMobileUserAgent = () =>
  ((a) =>
    /* eslint-disable-next-line */
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      a
    ) ||
    /* eslint-disable-next-line */
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ))(navigator.userAgent || navigator.vendor || (window as any).opera);

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

  const isDesktopPlatform = DESKTOP_VK_PLATFORMS.includes(platform);

  /**
   * Если обнаружили, что открыта десктопная платформа,
   * дальнейших проверок на платформу не делаем
   */
  if (isDesktopPlatform) {
    // Платформа desktop_web_messenger открывается в том числе
    // в браузере на мобильном устройстве
    if (platform === 'desktop_web_messenger') {
      const isAndroid = isAndroidUserAgent();
      const isIos = isIosUserAgent();
      const isMobile = isAndroid || isIos || isMobileUserAgent();

      if (!isMobile) {
        document.body.classList.add(VK_PLATFORM_CLASSNAME.desktop);
      }

      if (isMobile) {
        document.body.classList.add(VK_PLATFORM_CLASSNAME.mobile);

        if (isAndroid) {
          document.body.classList.add(VK_PLATFORM_CLASSNAME.android);
        }

        if (isIos) {
          document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);
        }
      }

      document.body.classList.add(VK_PLATFORM_CLASSNAME.web);

      return {
        isMobile,
        isMessenger: true,
        isWeb: true,
        isAndroid,
        isIos,
      };
    }

    document.body.classList.add(VK_PLATFORM_CLASSNAME.desktop);

    return {
      isMobile: false,
      isIos: false,
      isAndroid: false,
      // На всех платформах десктоп — это веб, кроме нативного десктоп-месседжера
      isWeb: platform !== 'desktop_app_messenger',
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

  if (isIosUserAgent()) {
    document.body.classList.add(VK_PLATFORM_CLASSNAME.ios);

    return {
      isMobile: true,
      isIos: true,
      isAndroid: false,
      isWeb: true,
      isMessenger,
    };
  }

  if (isAndroidUserAgent()) {
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
