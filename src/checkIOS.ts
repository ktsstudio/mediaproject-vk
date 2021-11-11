/*
 * Метод для проверки, является ли текущая платформа IOS.
 * Проверяет параметр platform, полученный при инициализации приложения.
 * В случае совпадения устанавливает window.is_ios = true и добавляет класс 'ios' на document.body
 * @param {string} platform Полученная от VK текущая платформа. По умолчанию берется из Window.platform.
 * @returns {boolean} Возвращает true, если платформа IOS
 */
export default (platform = window.platform): boolean => {
  if (
    platform === 'mobile_iphone' ||
    platform === 'mobile_iphone_messenger' ||
    /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
  ) {
    window.is_ios = true;

    document.body.classList.add('ios');

    return true;
  }

  return false;
};
