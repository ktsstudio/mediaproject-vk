import { ErrorData } from '@vkontakte/vk-bridge';

import { randomNumberUpTo } from './randomNumberUpTo';
import { randomString } from './randomString';
import { range } from './range';

export const getUserDeniedCommonError = ({
  reason = 'User denied',
}: {
  reason?: string;
} = {}): ErrorData => ({
  error_type: 'client_error',
  error_data: {
    error_reason: reason,
    error_code: 4,
  },
});

export const getRandomVkApiError = (): ErrorData => ({
  error_type: 'api_error',
  error_data: {
    error_code: randomNumberUpTo(100),
    error_msg: randomString(10),
    request_params: range(3).map(() => randomString(3)),
  },
});
