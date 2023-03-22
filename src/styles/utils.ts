const getNumberProperty = (propertyName: string): number => {
  const computedStyle = getComputedStyle(
    document.getElementById('root') ?? document.documentElement
  ).getPropertyValue(propertyName);

  return computedStyle ? Number.parseInt(computedStyle) : 0;
};

/**
 * Возвращает высоту верхней безопасной области в пикселях.
 * Использует переменную vkui --vkui_internal--safe_area_inset_top.
 */
export const getTopSafeArea = (): number =>
  getNumberProperty('--vkui_internal--safe_area_inset_top');

/**
 * Возвращает высоту нижней безопасной области в пикселях.
 * Использует переменную vkui --vkui_internal--safe_area_inset_bottom.
 */
export const getBottomSafeArea = (): number =>
  getNumberProperty('--vkui_internal--safe_area_inset_bottom');

/**
 * Высчитывает высоту верхнего отступа, прибавляя высоту верхней безопасной области.
 * @param {string} extraPadding Дополнительный отступ, по умолчанию '0px'
 * @return {string}
 */
export const calcTopPadding = (extraPadding = '0px'): string => {
  return `calc(var(--vkui_internal--safe_area_inset_top) + ${extraPadding})`;
};

/**
 * Высчитывает высоту нижнего отступа, прибавляя высоту нижней безопасной области.
 * @param {string} extraPadding Дополнительный отступ, по умолчанию '0px'
 * @return {string}
 */
export const calcBottomPadding = (extraPadding = '0px'): string => {
  return `calc(var(--vkui_internal--safe_area_inset_bottom) + ${extraPadding})`;
};
