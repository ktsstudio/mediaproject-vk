/**
 * Проверяет является ли мобильной платформа, на которой открыто vk-приложение.
 * Устанавливает window.is_mobile = true, если является.
 * Добавляет класс 'mobile' или 'desktop' на document.body в зависимости от результата проверки.
 * @param {string} platform Текущая платформа, получаемая при инициализации vk-приложения. По умолчанию window.platform.
 * @returns {boolean} Результат проверки.
 */
export default function checkMobile(platform = window.platform): boolean {
  const isMobile = platform.indexOf('mobile') !== -1;

  window.is_mobile = isMobile;
  document.body.classList.add(isMobile ? 'mobile' : 'desktop');

  return isMobile;
}
