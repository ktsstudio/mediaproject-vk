import { PlatformType } from './types/platform';

const IOS_PLATFORMS: PlatformType[] = [
  'mobile_ipad',
  'mobile_iphone',
  'mobile_iphone_messenger',
];

/*
 * Метод для проверки, является ли мобильной платформа, на которой открыто vk-приложение.
 * Устанавливает window.is_mobile = true, если является,
 *  и добавляет класс 'mobile' или 'desktop' на document.body в зависимости от результата проверки.
 */
const checkMobile = (
  platform: PlatformType | undefined = window.platform
): boolean => {
  const isMobile = Boolean(platform && platform.includes('mobile'));

  window.is_mobile = isMobile;

  document.body.classList.remove(isMobile ? 'desktop' : 'mobile');
  document.body.classList.add(isMobile ? 'mobile' : 'desktop');

  return isMobile;
};

/*
 * Метод для проверки, является ли текущая платформа IOS.
 * Проверяет параметр platform, полученный при инициализации приложения
 * и в случае совпадения устанавливает window.is_ios = true, а так же
 * добавляет класс 'ios' или 'android' на document.body
 */
const checkIOS = (
  platform: PlatformType | undefined = window.platform
): boolean => {
  const isIOS =
    (platform && IOS_PLATFORMS.includes(platform)) ||
    /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

  window.is_ios = isIOS;

  if (isIOS) {
    document.body.classList.add('ios');
  } else {
    document.body.classList.remove('ios');

    if (checkMobile()) {
      document.body.classList.add('android');
    }
  }

  return isIOS;
};

export { checkMobile, checkIOS };
