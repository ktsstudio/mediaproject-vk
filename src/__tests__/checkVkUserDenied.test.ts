import { ErrorData } from '@vkontakte/vk-bridge/dist/types/src/types/bridge';

import { checkVkUserDenied, userDeniedReasons } from '../checkVkUserDenied';

import { randomNumberUpTo, randomString, range } from './utils';

const getRandomStrings = () => range(3).map(() => randomString(24));

const getVkApiTypeError = ({
  errorReason,
  errorCode = randomNumberUpTo(100),
}: { errorReason?: string; errorCode?: number } = {}): ErrorData => ({
  error_type: 'api_error',
  error_data: errorReason
    ? {
        error_code: errorCode,
        error_msg: randomString(10),
        request_params: getRandomStrings(),
        // @ts-ignore
        error_reason: errorReason,
      }
    : {
        error_code: errorCode,
        error_msg: randomString(10),
        request_params: getRandomStrings(),
      },
  request_id: randomNumberUpTo(100),
});

const getVkAuthTypeError = ({
  errorReason = randomString(10),
  errorCode = randomNumberUpTo(100),
}: { errorReason?: string; errorCode?: number } = {}): ErrorData => ({
  error_type: 'auth_error',
  error_data: {
    error_code: errorCode,
    error_reason: errorReason,
  },
  request_id: randomNumberUpTo(100),
});

const getVKClientTypeError = ({
  errorReason = randomString(10),
  // +5, чтобы точно не было ошибки с кодом отказа 4
  errorCode = 5 + randomNumberUpTo(100),
} = {}): ErrorData => ({
  error_type: 'client_error',
  error_data: {
    error_code: errorCode,
    error_reason: errorReason,
    error_description: randomString(10),
  },
  request_id: randomNumberUpTo(100),
});

describe('Функция checkVkUserDenied', () => {
  it('Объект ошибки, соответствующий типу ошибки api_error', () => {
    expect(checkVkUserDenied(getVkApiTypeError())).toBe(false);
  });

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект ошибки, соответствующий типу ошибки api_error, ' +
        `но с error_reason "${reason}" и кодом ошибки 4`,
      () => {
        expect(
          checkVkUserDenied(
            getVkApiTypeError({ errorReason: reason, errorCode: 4 })
          )
        ).toBe(false);
      }
    );
  });

  it('Объект ошибки, соответствующий типу ошибки auth_error', () => {
    expect(checkVkUserDenied(getVkAuthTypeError())).toBe(false);
  });

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект ошибки, соответствующий типу ошибки auth_error, ' +
        `но с error_reason "${reason}" и кодом ошибки 4`,
      () => {
        expect(
          checkVkUserDenied(
            getVkAuthTypeError({ errorReason: reason, errorCode: 4 })
          )
        ).toBe(false);
      }
    );
  });

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект ошибки, соответствующий типу ошибки client_error ' +
        `с правильным error_reason "${reason}" и кодом ошибки 4`,
      () => {
        expect(
          checkVkUserDenied(
            getVKClientTypeError({ errorReason: reason, errorCode: 4 })
          )
        ).toBe(true);
      }
    );
  });

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект ошибки, соответствующий типу ошибки client_error с произвольным кодом ошибки, ' +
        `с правильным error_reason "${reason}", но в нижнем регистре`,
      () => {
        expect(
          checkVkUserDenied(
            getVKClientTypeError({
              errorReason: reason.toLowerCase(),
            })
          )
        ).toBe(false);
      }
    );
  });

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект ошибки, соответствующий типу ошибки client_error, ' +
        'с произвольным кодом ошибки, ' +
        `с правильным error_reason "${reason}"`,
      () => {
        expect(
          checkVkUserDenied(getVKClientTypeError({ errorReason: reason }))
        ).toBe(true);
      }
    );
  });

  it(
    'Объект ошибки, соответствующий типу ошибки client_error с кодом ошибки 4, ' +
      'с произвольной причиной ошибки',
    () => {
      expect(checkVkUserDenied(getVKClientTypeError({ errorCode: 4 }))).toBe(
        true
      );
    }
  );

  it(
    'Объект ошибки, соответствующий типу ошибки client_error ' +
      'с произвольным кодом ошибки, ' +
      'с произвольной причиной ошибки',
    () => {
      expect(checkVkUserDenied(getVKClientTypeError())).toBe(false);
    }
  );

  userDeniedReasons.forEach((reason) => {
    it(
      'Объект, содержащий минимально достаточные поля, с типом ошибки client_error ' +
        `с причиной ошибки "${reason}" и кодом ошибки 4`,
      () => {
        expect(
          checkVkUserDenied({
            error_type: 'client_error',
            error_data: {
              error_reason: reason,
              error_code: 4,
            },
          })
        ).toBe(true);
      }
    );
  });
});
