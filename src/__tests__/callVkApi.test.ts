import originalBridge from '@vkontakte/vk-bridge';
import { AnyRequestMethodName } from '@vkontakte/vk-bridge/dist/types/src/types/bridge';

import { getVkAccessToken as originalGetVkAccessToken } from '../getVkAccessToken';
import { callVkApi, VK_TOKEN_ERRORS } from '../callVkApi';
import { GetVkAccessTokenParamsType } from '../types';

import { getRandomVkApiError, randomNumberUpTo, randomString } from './utils';

jest.mock('@vkontakte/vk-bridge');
jest.mock('../getVkAccessToken');

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;
const getVkAccessToken = originalGetVkAccessToken as jest.MockedFn<
  typeof originalGetVkAccessToken
>;

type BridgeSendReturn = ReturnType<typeof bridge.send>;

const MOCK_VK_BRIDGE_CUSTOM_METHOD =
  'MOCK_VK_BRIDGE_CUSTOM_METHOD' as AnyRequestMethodName;

const MOCK_VK_API_VERSION = 'MOCK_VK_API_VERSION';

const VK_BRIDGE_VK_API_METHOD = 'VKWebAppCallAPIMethod';

const MOCK_TOKEN = 'MOCK_TOKEN';
const MOCK_NEW_TOKEN = 'MOCK_NEW_TOKEN';

const MOCK_SUCCESS = 'MOCK_SUCCESS' as unknown as BridgeSendReturn;

const MOCK_ANY_ERROR = getRandomVkApiError();

const MOCK_GET_TOKEN_PARAMS = {
  [randomString(5)]: randomString(5),
} as GetVkAccessTokenParamsType;

const getMockTokenExpiredError = ({
  isWeb = true,
  message = VK_TOKEN_ERRORS[0],
}: {
  isWeb?: boolean;
  message?: string;
} = {}) => ({
  error_type: 'some error type',
  error_data: isWeb
    ? {
        error_reason: {
          error_msg: message,
        },
      }
    : {
        error_msg: message,
      },
});

/**
 * Подготовить кейсы возникновения ошибки о протухшем токене: на вебе/мобиле и с различным сообщением об ошибке
 */
const getMockTokenExpiredErrorCases = () =>
  [true, false].reduce<{ isWeb: boolean; message: string }[]>(
    (acc, isWeb) => [
      ...acc,
      ...VK_TOKEN_ERRORS.map((message) => ({ isWeb, message })),
    ],
    []
  );

/**
 * Проверка на передачу в бридж токена
 */
const expectBridgeCalledWithToken = ({
  token,
  nthTime,
}: {
  token: string;
  nthTime?: number;
}) => {
  if (nthTime) {
    return expect(bridge.send).toHaveBeenNthCalledWith(
      nthTime,
      VK_BRIDGE_VK_API_METHOD,
      expect.objectContaining({
        params: expect.objectContaining({
          access_token: token,
        }),
      })
    );
  }

  expect(bridge.send).toHaveBeenCalledWith(
    VK_BRIDGE_VK_API_METHOD,
    expect.objectContaining({
      params: expect.objectContaining({
        access_token: token,
      }),
    })
  );
};

/**
 * Кейсы:
 * Передача ответа бриджа:
 * 1. Успешный запрос с изначально корректным токеном.
 * 2. Некоторая ошибка (в том числе из-за возможно некорректного токена).
 *
 * Получение нового токена:
 * 3. Успешный запрос, нет токена, токен должен быть получен один раз.
 * 4. Некоторая ошибка (в том числе из-за возможного некорректного токена),
 *    нет токена, токен должен быть получен один раз.
 * 5. Успешный запрос, изначально протухший токен,
 *    новый токен должен быть получен один раз.
 * 6. Некоторая ошибка (в том числе из-за возможного некорректного токена)
 *    после получения нового токена. Изначально протухший токен,
 *    новый токен должен быть получен один раз.
 * 7. Запрос с некоторым ответом, изначально протухший токен.
 *    Новый токен получать не нужно.
 *
 * Правильная передача параметров запроса:
 * 8. Запрос, название метода передаётся в бридж.
 * 9. Запрос, версия VK API передаётся в параметры.
 * 10. Запрос, токена нет, параметры для получения токена
 *     передаются в getVkAccessToken, новый токен передаётся в бридж.
 * 11. Запрос, токен передаётся в бридж.
 * 12. Запрос, протухший токен передаётся в бридж,
 *     затем новый токен передаётся в бридж. Параметры получения токена
 *     передаются в getVkAccessToken.
 * 13. Запрос, дополнительные параметры передаются в бридж.
 */
describe('Функция callVkApi', () => {
  afterEach(() => {
    bridge.send.mockClear();
    getVkAccessToken.mockClear();
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.send.mockImplementation(() => Promise.resolve());
    getVkAccessToken.mockImplementation(() => Promise.resolve(''));
  });

  it('Успешный запрос с изначально корректным токеном', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const result = await callVkApi({
      accessToken: MOCK_TOKEN,
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      renewTokenIfExpired: true,
      getAccessTokenParams: {},
    });

    expect(bridge.send).toBeCalledTimes(1);
    expect(result).toBe(MOCK_SUCCESS);
  });

  it('Некоторая ошибка (в том числе из-за возможно некорректного токена)', async () => {
    bridge.send.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    const result = await callVkApi({
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      accessToken: MOCK_TOKEN,
      renewTokenIfExpired: true,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_ANY_ERROR);
  });

  it('Успешный запрос, нет токена, токен должен быть получен один раз', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const result = await callVkApi({
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      renewTokenIfExpired: true,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_SUCCESS);
    expect(bridge.send).toBeCalledTimes(1);
    expect(getVkAccessToken).toBeCalledTimes(1);
  });

  it(
    'Некоторая ошибка (в том числе из-за возможного некорректного токена), ' +
      'нет токена, токен должен быть получен один раз',
    async () => {
      bridge.send.mockImplementation(() => {
        throw MOCK_ANY_ERROR;
      });

      const result = await callVkApi({
        method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
        renewTokenIfExpired: true,
        getAccessTokenParams: {},
      });

      expect(result).toBe(MOCK_ANY_ERROR);
      expect(bridge.send).toBeCalledTimes(1);
      expect(getVkAccessToken).toBeCalledTimes(1);
    }
  );

  getMockTokenExpiredErrorCases().forEach(({ message, isWeb }) => {
    it(
      'Успешный запрос, изначально протухший токен, ' +
        'новый токен должен быть получен один раз. ' +
        `Ошибка: ${message}, веб: ${isWeb}`,
      async () => {
        getVkAccessToken.mockImplementation(() => Promise.resolve(MOCK_TOKEN));

        // Первый вызов bridge.send породит ошибку, второй — успех
        bridge.send
          .mockImplementationOnce(() => {
            throw getMockTokenExpiredError({
              isWeb,
              message,
            });
          })
          .mockImplementationOnce(() => MOCK_SUCCESS);

        const result = await callVkApi({
          method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
          accessToken: MOCK_TOKEN,
          renewTokenIfExpired: true,
          getAccessTokenParams: {},
        });

        expect(result).toBe(MOCK_SUCCESS);
        expect(bridge.send).toBeCalledTimes(2);
        expect(getVkAccessToken).toBeCalledTimes(1);
      }
    );
  });

  getMockTokenExpiredErrorCases().forEach(({ message, isWeb }) => {
    it(
      'Некоторая ошибка (в том числе из-за возможного некорректного токена) ' +
        'после получения нового токена. Изначально протухший токен, ' +
        'новый токен должен быть получен один раз. ' +
        `Ошибка: ${message}, веб: ${isWeb}`,
      async () => {
        getVkAccessToken.mockImplementation(() => Promise.resolve(MOCK_TOKEN));

        bridge.send
          .mockImplementationOnce(() => {
            throw getMockTokenExpiredError({
              isWeb,
              message,
            });
          })
          .mockImplementationOnce(() => {
            throw MOCK_ANY_ERROR;
          });

        const result = await callVkApi({
          method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
          accessToken: MOCK_TOKEN,
          renewTokenIfExpired: true,
          getAccessTokenParams: {},
        });

        expect(result).toBe(MOCK_ANY_ERROR);
        expect(bridge.send).toBeCalledTimes(2);
        expect(getVkAccessToken).toBeCalledTimes(1);
      }
    );
  });

  getMockTokenExpiredErrorCases().forEach(({ message, isWeb }) => {
    it(
      'Запрос с некоторым ответом, изначально протухший токен. ' +
        'Новый токен получать не нужно. ' +
        `Ошибка: ${message}, веб: ${isWeb}`,
      async () => {
        const tokenExpiredError = getMockTokenExpiredError({
          isWeb,
          message,
        });

        bridge.send.mockImplementation(() => {
          throw tokenExpiredError;
        });

        const result = await callVkApi({
          method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
          accessToken: MOCK_TOKEN,
          renewTokenIfExpired: false,
          getAccessTokenParams: {},
        });

        expect(result).toBe(tokenExpiredError);
        expect(bridge.send).toBeCalledTimes(1);
        expect(getVkAccessToken).toBeCalledTimes(0);
      }
    );
  });

  it('Запрос, название метода передаётся в бридж', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const result = await callVkApi({
      accessToken: MOCK_TOKEN,
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_SUCCESS);
    expect(bridge.send).toBeCalledTimes(1);
    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_VK_API_METHOD,
      expect.objectContaining({
        method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      })
    );
  });

  it('Запрос, версия VK API передаётся в параметры', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const result = await callVkApi({
      version: MOCK_VK_API_VERSION,
      accessToken: MOCK_TOKEN,
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_SUCCESS);
    expect(bridge.send).toBeCalledTimes(1);
    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_VK_API_METHOD,
      expect.objectContaining({
        params: expect.objectContaining({
          v: MOCK_VK_API_VERSION,
        }),
      })
    );
  });

  it(
    'Запрос, токена нет, параметры для получения токена ' +
      'передаются в getVkAccessToken, новый токен передаётся в бридж',
    async () => {
      getVkAccessToken.mockImplementation(() =>
        Promise.resolve(MOCK_NEW_TOKEN)
      );

      bridge.send.mockImplementation(() => MOCK_SUCCESS);

      const result = await callVkApi({
        method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
        getAccessTokenParams: MOCK_GET_TOKEN_PARAMS,
      });

      expect(result).toBe(MOCK_SUCCESS);

      expect(getVkAccessToken).toBeCalledTimes(1);
      expect(getVkAccessToken).toBeCalledWith(MOCK_GET_TOKEN_PARAMS);

      expect(bridge.send).toBeCalledTimes(1);
      expectBridgeCalledWithToken({ token: MOCK_NEW_TOKEN });
    }
  );

  it('Запрос, токен передаётся в бридж', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const result = await callVkApi({
      accessToken: MOCK_TOKEN,
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_SUCCESS);
    expect(bridge.send).toBeCalledTimes(1);
    expectBridgeCalledWithToken({ token: MOCK_TOKEN });
  });

  it(
    'Запрос, протухший токен передаётся в бридж, ' +
      'затем новый токен передаётся в бридж. Параметры получения токена ' +
      'передаются в getVkAccessToken',
    async () => {
      getVkAccessToken.mockImplementation(() =>
        Promise.resolve(MOCK_NEW_TOKEN)
      );

      bridge.send
        .mockImplementationOnce(() => {
          throw getMockTokenExpiredError();
        })
        .mockImplementationOnce(() => MOCK_SUCCESS);

      const result = await callVkApi({
        accessToken: MOCK_TOKEN,
        method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
        renewTokenIfExpired: true,
        getAccessTokenParams: MOCK_GET_TOKEN_PARAMS,
      });

      expect(result).toBe(MOCK_SUCCESS);

      expect(getVkAccessToken).toBeCalledTimes(1);
      expect(getVkAccessToken).toBeCalledWith(MOCK_GET_TOKEN_PARAMS);

      expect(bridge.send).toBeCalledTimes(2);
      expectBridgeCalledWithToken({ nthTime: 1, token: MOCK_TOKEN });
      expectBridgeCalledWithToken({ nthTime: 2, token: MOCK_NEW_TOKEN });
    }
  );

  it('Запрос, дополнительные параметры передаются в бридж', async () => {
    bridge.send.mockImplementation(() => MOCK_SUCCESS);

    const customParams = {
      [randomString(5)]: randomNumberUpTo(100),
      [randomNumberUpTo(100)]: randomString(10),
    };

    const result = await callVkApi({
      accessToken: MOCK_TOKEN,
      method: MOCK_VK_BRIDGE_CUSTOM_METHOD,
      params: customParams,
      getAccessTokenParams: {},
    });

    expect(result).toBe(MOCK_SUCCESS);
    expect(bridge.send).toBeCalledTimes(1);
    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_VK_API_METHOD,
      expect.objectContaining({
        params: expect.objectContaining({ ...customParams }),
      })
    );
  });
});
