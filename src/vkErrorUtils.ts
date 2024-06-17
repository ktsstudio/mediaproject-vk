import { ErrorData } from '@vkontakte/vk-bridge';

import { isVkError } from './isVkError';

/**
 * Утилита парсинг сообщения из различных типов VK API ошибок {@link ErrorData}
 *
 * @param {ErrorData} error Ошибка, полученная от VK API.
 * @returns {string} Сообщение об ошибке, полученное от VK API.
 *
 * Подробнее виды ошибок VK API можно посмотреть в:
 * @see https://dev.vk.com/ru/bridge/getting-started#Обработка%20ошибок%20VK%20Bridge
 * @see https://github.com/VKCOM/vk-bridge/blob/master/packages/core/src/types/bridge.ts#L86
 */
export const parseVkErrorMessage = (error: ErrorData): string => {
  if (error.error_type === 'api_error') {
    return error.error_data.error_msg;
  }

  const { error_reason } = error.error_data;

  // LEGACY: парсинг возможного нестандартного формата ошибки
  // NOTE: в задокументированных форматах ошибок поле error_reason имеет тип string
  // TODO: удалить если нестандартные ошибки больше не встречается
  if (
    typeof error_reason === 'object' &&
    error_reason !== null &&
    'error_msg' in error_reason &&
    typeof error_reason['error_msg'] === 'string'
  ) {
    return error_reason['error_msg'];
  }

  return error_reason;
};

/**
 * Утилита для случая когда нужно вернуть стандартный формат ошибки VK API,
 * получив ошибку или данные неизвестного типа
 *
 * @param {unknown} error Ошибка неизвестного типа
 * @returns {ErrorData} Ошибка VK API
 */
export const toVkError = (error: unknown): ErrorData => {
  if (isVkError(error)) {
    return error;
  }

  return makeUnknownVkError(error);
};

/**
 * Утилита обертки неопределенных данных в имитацию ошибки VK API
 *
 * @param {unknown} data Данные неизвестного типа
 * @returns {ErrorData} Имитация ошибки VK API
 */
export const makeUnknownVkError = (data: unknown): ErrorData => {
  return {
    error_type: 'client_error',
    error_data: {
      error_code: -111_000_111,
      error_reason: 'unknown',
      error_description: toStringInfo(data),
    },
  };
};

const toStringInfo = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};
