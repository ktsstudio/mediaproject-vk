/**
 * Checks whether platform fits mobile device.
 * Sets field window.is_mobile = true, if true.
 * Adds classname 'mobile' or 'desktop' to document.body.
 * @param {string} platform Taken from VK current platform. Taken from Window by default
 * @returns Result of checking.
 */
export default function checkMobile(platform = window.platform): boolean {
  const isMobile = platform.indexOf('mobile') !== -1;

  window.is_mobile = isMobile;

  if (isMobile) {
    document.body.classList.add('mobile');
  } else {
    document.body.classList.add('desktop');
  }

  return isMobile;
}
