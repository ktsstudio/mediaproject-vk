import { ErrorData } from '@vkontakte/vk-bridge';

const vkErrorTypes = new Set<ErrorData['error_type']>([
  'client_error',
  'api_error',
  'auth_error',
]);

/**
 * Утилита для проверки произвольного значения на соответствие
 * типу {@link ErrorData}, обозначающему ошибку, приходящую от API VK
 *
 * @param {any} value Произвольное значение.
 * @returns {boolean} Если переданное значение соответствует
 * типу ошибки от API VK, возвращает true, а компилятор TypeScript
 * будет считать, что переданное значение имеет тип {@link ErrorData}.
 * Иначе функция возвращает false, а TypeScript считает,
 * что переданное значение не имеет тип {@link ErrorData}
 *
 * @example
 * try {
 *   await bridge.send(...);
 * } catch (error) {
 *   if (!isVkError(error)) {
 *     return;
 *   }
 *
 *   if (checkVkUserDenied(error)) {
 *     return;
 *   }
 * }
 */
const isVkError = (value: any): value is ErrorData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error_data' in value &&
    vkErrorTypes.has(value?.error_type)
  );
};

export { isVkError };
