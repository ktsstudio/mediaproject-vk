import checkMobile from './checkMobile';

/**
 * Method to check current platform is IOS.
 * Sets Window.is_ios = true if matches.
 * Adds classname 'ios' or 'android' to document.body.
 * @param {string} platform Taken from VK current platform. Taken from Window by default
 * @returns {boolean} Returns true if matches
 */
export default (platform = window.platform): boolean => {
  const isIOS =
    platform === 'mobile_ipad' ||
    platform === 'mobile_iphone' ||
    platform === 'mobile_iphone_messenger' ||
    /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

  if (isIOS) {
    window.is_ios = true;
    document.body.classList.add('ios');
  } else if (checkMobile()) {
    document.body.classList.add('android');
  }

  return isIOS;
};
