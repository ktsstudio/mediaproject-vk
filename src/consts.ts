import { ErrorData } from '@vkontakte/vk-bridge';

/**
 * Set, состоящий из строк, обозначающих типы ошибки (поле error_type),
 * приходящей от VK Bridge
 */
const vkErrorTypes = new Set<ErrorData['error_type']>([
  'client_error',
  'api_error',
  'auth_error',
]);

export { vkErrorTypes };
