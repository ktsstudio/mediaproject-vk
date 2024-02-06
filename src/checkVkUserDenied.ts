import { ErrorData } from '@vkontakte/vk-bridge';

const userDeniedReasons = new Set(['User denied', 'Operation denied by user']);

/**
 * Утилита для проверки, что пришедшая от API ВКонтакте ошибка,
 * получена в результате отказа пользователя от какого-либо необходимого действия.
 * Например, если при попытке шеринга поста на стену пользователь в системной модалке отказался от публикации поста.
 *
 * @param {ErrorData} error Ошибка, полученная от API ВКонтакте.
 * @returns {boolean} Если действительно ошибка возникла по причине отказа пользователя, возвращает true. Иначе возвращает false.
 */
const checkVkUserDenied = (error: ErrorData): boolean => {
  if (!error || !error.error_data || error.error_type !== 'client_error') {
    return false;
  }

  const {
    error_data: { error_reason, error_code },
  } = error;

  return userDeniedReasons.has(error_reason) || error_code === 4;
};

export { checkVkUserDenied };
