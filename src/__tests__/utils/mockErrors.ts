import { ErrorData } from '@vkontakte/vk-bridge';

import { randomNumberUpTo } from './randomNumberUpTo';
import { randomString } from './randomString';
import { range } from './range';

export const getUserDeniedCommonError = ({
  reason = 'User denied',
  requestId = randomString(10),
}: {
  reason?: string;
  requestId?: string | number;
} = {}): ErrorData => ({
  error_type: 'client_error',
  error_data: {
    error_reason: reason,
    error_code: 4,
  },
  request_id: requestId,
});

export const getRandomVkApiError = (): ErrorData => ({
  error_type: 'api_error',
  error_data: {
    error_code: randomNumberUpTo(100),
    error_msg: randomString(10),
    request_params: range(3).map(() => randomString(3)),
  },
});

export const getRandomVkClientError = (): ErrorData => ({
  error_type: 'client_error',
  error_data: {
    error_code: randomNumberUpTo(100),
    error_reason: randomString(10),
    error_description: randomString(10),
  },
  request_id: randomNumberUpTo(100),
});

export const getRandomVkAuthError = (): ErrorData => ({
  error_type: 'auth_error',
  error_data: {
    error_code: randomNumberUpTo(100),
    error_reason: randomString(10),
  },
  request_id: randomNumberUpTo(100),
});

export const getRandomVkErrorEachType = (): ErrorData[] => [
  getRandomVkClientError(),
  getRandomVkApiError(),
  getRandomVkAuthError(),
];
