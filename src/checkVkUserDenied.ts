import { ErrorData } from '@vkontakte/vk-bridge';

/**
 * Утилита для проверки, что пришедшая от API ВКонтакте ошибка,
 * получена в результате отказа пользователя от какого-либо необходимого действия.
 * Например, если при попытке шеринга поста на стену пользователь в системной модалке отказался от публикации поста.
 *
 * @param {ErrorData} error Ошибка, полученная от API ВКонтакте.
 * @returns {boolean} Если действительно ошибка возникла по причине отказа пользователя, возвращает true. Иначе возвращает false.
 */
const checkVkUserDenied = (error: ErrorData): boolean =>
  error?.error_type === 'client_error' &&
  (error?.error_data?.error_reason === 'User denied' ||
    error?.error_data?.error_reason === 'Operation denied by user') &&
  error?.error_data?.error_code === 4;

export { checkVkUserDenied };
