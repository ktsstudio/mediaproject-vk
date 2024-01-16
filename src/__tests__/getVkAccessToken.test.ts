import originalBridge, {
  PersonalAuthScope,
  ReceiveData,
} from '@vkontakte/vk-bridge';
import { RequestProps } from '@vkontakte/vk-bridge/dist/types/src/types/bridge';
import { ReceiveDataMap } from '@vkontakte/vk-bridge/dist/types/src/types/data';

import {
  ALLOWED_VK_SCOPES,
  checkOneScopesSetIncludesAnother,
  getNewVkAccessToken,
  getVkAccessToken,
  parseVkScopes,
} from '../getVkAccessToken';
import { GetVkAccessTokenParamsType } from '../types';

import {
  getRandomElements,
  getRandomVkApiError,
  getUserDeniedCommonError,
  randomNumberUpTo,
  randomString,
  range,
} from './utils';

jest.mock('@vkontakte/vk-bridge');

type ScopesPair = {
  available: PersonalAuthScope[];
  toRequest: PersonalAuthScope[];
};

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

const BRIDGE_GET_TOKEN_METHOD = 'VKWebAppGetAuthToken';

const MOCK_APP_ID = 9999999;

const MOCK_SCOPES: PersonalAuthScope[] = ['docs', 'groups'];

const MOCK_SCOPES_STRING = 'docs,groups';

const MOCK_TOKEN = 'MOCK_TOKEN';

const MOCK_AVAILABLE_TOKEN = 'MOCK_AVAILABLE_TOKEN';

const MOCK_TOKEN_ANSWER: ReceiveDataMap['VKWebAppGetAuthToken'] = {
  access_token: 'MOCK_TOKEN',
  scope: 'MOCK_SCOPE',
};

const MOCK_ANY_ERROR = getRandomVkApiError();

const getRandomScopes = (count: number) =>
  getRandomElements(ALLOWED_VK_SCOPES, count);

/**
 * Получить три количества скоупов для дальнейшего парсинга случайных скоупов:
 * * Один скоуп (минимальное количество)
 * * Случайное количество от 2 до 11 включительно
 * * 12 скоупов (максимальное количество)
 */
const getScopesCounts = () => [
  1,
  2 + randomNumberUpTo(ALLOWED_VK_SCOPES.length - 2),
  ALLOWED_VK_SCOPES.length,
];

/**
 * Получить полностью непересекающиеся множества имеющихся и запрашиваемых скоупов.
 * Исключается случай, когда имеющися скоуп пустой
 */
const getNonOverlappingScopes = (): ScopesPair[] => [
  { available: ['stats'], toRequest: ['docs'] },
  { available: ['docs', 'groups', 'video'], toRequest: ['status'] },
  { available: ['docs'], toRequest: ['status', 'groups', 'stories'] },
];

/**
 * Получить множества имеющихся и запрашиваемых скоупов,
 * где запрашиваемый скоуп является подмножеством имеющегося
 * или полностью совпадает с ним.
 */
const getScopesWithRequestPartlyOverlapping = (): ScopesPair[] => [
  { available: ['stats', 'docs'], toRequest: ['docs'] },
  { available: ['stats', 'docs', 'groups'], toRequest: ['docs', 'groups'] },
  {
    available: ['stats', 'docs', 'groups', 'market'],
    toRequest: ['groups', 'market'],
  },
  {
    available: ['stats', 'docs', 'groups', 'market'],
    toRequest: ['stats', 'docs', 'groups', 'market'],
  },
];

/**
 * Получить множества имеющихся и запрашиваемых скоупов,
 * где имеющийся (доступный) скоуп является подмножеством запрашиваемого.
 */
const getScopesWithAvailablePartlyOverlapping = (): ScopesPair[] => [
  { available: ['docs'], toRequest: ['stats', 'docs'] },
  { available: ['docs', 'groups'], toRequest: ['stats', 'docs', 'groups'] },
  {
    available: ['groups', 'market'],
    toRequest: ['stats', 'docs', 'groups', 'market'],
  },
];

/**
 * Получить пары запрашиваемых и фактически получаемых скоупов
 * для теста поведения пользователя
 */
const getRequestToResultScopes = (): {
  requestScopes: PersonalAuthScope[];
  resultScopes: PersonalAuthScope[];
}[] => [
  {
    requestScopes: ['docs', 'friends', 'status'],
    resultScopes: ['docs'],
  },
  {
    requestScopes: ['docs', 'friends', 'status'],
    resultScopes: ['docs', 'friends'],
  },
];

describe('Функция parseVkScopes', () => {
  getScopesCounts().forEach((count) => {
    it(`Правильный парсинг скоупов, количество скоупов: ${count}`, () => {
      const randomScopes = getRandomScopes(count);
      const scopesString = randomScopes.join(',');

      expect(parseVkScopes(scopesString)).toEqual(randomScopes);
    });
  });

  [', ', ' ,', ' ', ';'].forEach((join) => {
    it(`Неправильный разделитель строк: "${join}"`, () => {
      const scopes = getRandomScopes(6);
      const scopesString = scopes.join(join);

      expect(parseVkScopes(scopesString)).not.toEqual(scopes);
    });
  });

  it('Пустая строка', () => {
    expect(parseVkScopes('')).toEqual([]);
  });

  it('Случайная строка', () => {
    expect(parseVkScopes(randomString(20))).toEqual([]);
  });

  it('Строка с разделёнными запятыми случайными строками', () => {
    const incorrectScopes = range(10)
      .map(() => randomString(5))
      .join(',');

    expect(parseVkScopes(incorrectScopes)).not.toEqual(incorrectScopes);
  });
});

describe('Функция checkOneScopesSetIncludesAnother', () => {
  getScopesCounts().forEach((count) => {
    it(`Правильное сравнение одинаковых наборов скоупов, количество скоупов: ${count}`, () => {
      const scopes = getRandomScopes(count);

      expect(
        checkOneScopesSetIncludesAnother(new Set(scopes), new Set(scopes))
      ).toBeTruthy();
    });
  });

  it('Один скоуп является подмножеством другого', () => {
    const scopeA: PersonalAuthScope[] = ['stats', 'groups', 'stories', 'notes'];
    const scopeB = scopeA.slice(-1);

    expect(
      checkOneScopesSetIncludesAnother(new Set(scopeA), new Set(scopeB))
    ).toBeFalsy();
  });

  it('Полностью несовпадающие наборы скоупов', () => {
    const scopeA: PersonalAuthScope[] = ['stats', 'groups', 'stories', 'notes'];
    const scopeB: PersonalAuthScope[] = ['friends', 'docs', 'video', 'status'];

    expect(
      checkOneScopesSetIncludesAnother(new Set(scopeA), new Set(scopeB))
    ).toBeFalsy();
  });

  it('Первый набор скоупов пустой', () => {
    const scopeA: PersonalAuthScope[] = [];
    const scopeB: PersonalAuthScope[] = ['friends', 'docs', 'video', 'status'];

    expect(
      checkOneScopesSetIncludesAnother(new Set(scopeA), new Set(scopeB))
    ).toBeTruthy();
  });

  it('Второй набор скоупов пустой', () => {
    const scopeA: PersonalAuthScope[] = ['stats', 'groups', 'stories', 'notes'];
    const scopeB: PersonalAuthScope[] = [];

    expect(
      checkOneScopesSetIncludesAnother(new Set(scopeA), new Set(scopeB))
    ).toBeFalsy();
  });
});

describe('Функция getNewVkAccessToken', () => {
  afterEach(() => {
    bridge.send.mockClear();
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.send.mockImplementation(() => Promise.resolve());
  });

  [0, ...getScopesCounts()].forEach((count) => {
    it(`Получение токена по переданным скоупам, количество скоупов: ${count}`, async () => {
      bridge.send.mockImplementation(() => Promise.resolve(MOCK_TOKEN_ANSWER));

      const result = await getNewVkAccessToken({
        appId: MOCK_APP_ID,
        scopes: getRandomScopes(count),
      });

      expect(result).toEqual(MOCK_TOKEN_ANSWER);
      expect(bridge.send).toBeCalledTimes(1);
    });
  });

  [0, ...getScopesCounts()].forEach((count) => {
    it('В бридж передаётся строка со скоупами, переданными в массиве в аргументе', async () => {
      bridge.send.mockImplementation(() => Promise.resolve(MOCK_TOKEN_ANSWER));

      const sortedInputScopes = getRandomScopes(count).sort();
      const sortedInputScopesString = sortedInputScopes.join(',');

      const result = await getNewVkAccessToken({
        appId: MOCK_APP_ID,
        scopes: sortedInputScopes,
      });

      const bridgeScopesStringCalledWith = bridge.send.mock
        .calls[0][1] as RequestProps<'VKWebAppGetAuthToken'>;
      const bridgeScopesCalledWith = bridgeScopesStringCalledWith.scope
        .split(',')
        .sort()
        .join(',');

      expect(result).toEqual(MOCK_TOKEN_ANSWER);
      expect(bridge.send).toBeCalledTimes(1);
      expect(sortedInputScopesString).toEqual(bridgeScopesCalledWith);
    });
  });

  it('Ошибка возвращается', async () => {
    bridge.send.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    const result = await getNewVkAccessToken({
      appId: MOCK_APP_ID,
      scopes: MOCK_SCOPES,
    });

    expect(result).toEqual(MOCK_ANY_ERROR);
    expect(bridge.send).toBeCalledTimes(1);
  });

  it('В бридж передаётся id приложения', async () => {
    bridge.send.mockImplementation(() => Promise.resolve(MOCK_TOKEN_ANSWER));

    const result = await getNewVkAccessToken({
      appId: MOCK_APP_ID,
      scopes: MOCK_SCOPES,
    });

    expect(result).toEqual(MOCK_TOKEN_ANSWER);
    expect(bridge.send).toBeCalledTimes(1);
    expect(bridge.send).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        app_id: MOCK_APP_ID,
      })
    );
  });

  it('Бридж вызывает метод для получения токена', async () => {
    bridge.send.mockImplementation(() => Promise.resolve(MOCK_TOKEN_ANSWER));

    const result = await getNewVkAccessToken({
      appId: MOCK_APP_ID,
      scopes: MOCK_SCOPES,
    });

    expect(result).toEqual(MOCK_TOKEN_ANSWER);
    expect(bridge.send).toBeCalledTimes(1);
    expect(bridge.send).toHaveBeenCalledWith(
      BRIDGE_GET_TOKEN_METHOD,
      expect.anything()
    );
  });
});

describe('Функция getVkAccessToken', () => {
  const mockOnUserDeniedSomeScopes = jest.fn();
  const mockOnUserDeniedAll = jest.fn();
  const mockOnErrorOccurred = jest.fn();

  const getErrorCallbacks = (): Pick<
    GetVkAccessTokenParamsType,
    'onErrorOccurred' | 'onUserDeniedSomeScopes' | 'onUserDeniedAll'
  > => ({
    onErrorOccurred: mockOnErrorOccurred,
    onUserDeniedAll: mockOnUserDeniedAll,
    onUserDeniedSomeScopes: mockOnUserDeniedSomeScopes,
  });

  const expectNoErrorsOccurred = () => {
    expect(mockOnUserDeniedSomeScopes).not.toHaveBeenCalled();
    expect(mockOnUserDeniedAll).not.toHaveBeenCalled();
    expect(mockOnErrorOccurred).not.toHaveBeenCalled();
  };

  beforeAll(() => {
    window.access_token = undefined;
    window.scope = undefined;
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.send.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    bridge.send.mockClear();
    window.access_token = undefined;
    window.scope = undefined;
    mockOnUserDeniedSomeScopes.mockClear();
    mockOnUserDeniedAll.mockClear();
    mockOnErrorOccurred.mockClear();
  });

  [0, ...getScopesCounts()].forEach((count) => {
    it(
      'Успешный запрос за токеном при отсутствии ' +
        'доступных токена и скоупов (поля в window равны undefined). ' +
        `Количество запрашиваемых скоупов: ${count}`,
      async () => {
        const scopes = getRandomScopes(count).sort();
        const scopesString = scopes.join(',');

        bridge.send.mockImplementation(() =>
          Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
            scope: scopesString,
            access_token: MOCK_TOKEN,
            ...getErrorCallbacks(),
          })
        );

        const result = await getVkAccessToken({
          scopes,
          appId: MOCK_APP_ID,
        });

        expect(result).toEqual(MOCK_TOKEN);
        expect(window.scope?.split(',').sort().join(',')).toBe(scopesString);
        expect(window.access_token).toBe(MOCK_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(1);
        expectNoErrorsOccurred();
      }
    );
  });

  [
    ...getNonOverlappingScopes(),
    ...getScopesWithAvailablePartlyOverlapping(),
  ].forEach(({ toRequest, available }) => {
    it(
      'Успешный запрос. Множество имеющихся скоупов ' +
        'полностью не совпадает с множеством запрашиваемых скоупов ' +
        'или множество имеющихся скоупов является подмножеством запрашиваемых. ' +
        `Имеющиеся скоупы: ${available}. Запрашиваемые скоупы: ${toRequest}`,
      async () => {
        window.access_token = MOCK_AVAILABLE_TOKEN;
        window.scope = available.join(',');

        const resultScopes = [...new Set([...toRequest, ...available])].sort();
        const resultScopesString = resultScopes.join(',');

        bridge.send.mockImplementation(() =>
          Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
            scope: resultScopesString,
            access_token: MOCK_TOKEN,
            ...getErrorCallbacks(),
          })
        );

        const result = await getVkAccessToken({
          scopes: toRequest,
          appId: MOCK_APP_ID,
        });

        expect(result).toEqual(MOCK_TOKEN);
        expect(window.scope?.split(',').sort().join(',')).toBe(
          resultScopesString
        );
        expect(window.access_token).toBe(MOCK_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(1);
        expectNoErrorsOccurred();
      }
    );
  });

  [...getScopesWithRequestPartlyOverlapping()].forEach(
    ({ toRequest, available }) => {
      it(
        'Успешный запрос. Множество запрашиваемых скоупов ' +
          'является подмножеством имеющихся скоупов. ' +
          `Имеющиеся скоупы: ${available}. Запрашиваемые скоупы: ${toRequest}`,
        async () => {
          window.access_token = MOCK_AVAILABLE_TOKEN;
          window.scope = available.join(',');

          const resultScopes = [
            ...new Set([...toRequest, ...available]),
          ].sort();
          const resultScopesString = resultScopes.join(',');

          bridge.send.mockImplementation(() =>
            Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
              scope: resultScopesString,
              access_token: MOCK_AVAILABLE_TOKEN,
            })
          );

          const result = await getVkAccessToken({
            scopes: toRequest,
            appId: MOCK_APP_ID,
            ...getErrorCallbacks(),
          });

          expect(result).toEqual(MOCK_AVAILABLE_TOKEN);
          expect(window.scope?.split(',').sort().join(',')).toBe(
            resultScopesString
          );
          expect(window.access_token).toBe(MOCK_AVAILABLE_TOKEN);
          expect(bridge.send).toHaveBeenCalledTimes(0);
          expectNoErrorsOccurred();
        }
      );
    }
  );

  getScopesCounts().forEach((count) => {
    it(
      'Запрашивается пустое множество скоупов при уже имеющемся множестве скоупов. ' +
        `Количество доступных скоупов: ${count}`,
      async () => {
        const availableScopes = getRandomScopes(count).sort();
        const availableScopesString = availableScopes.join(',');

        window.access_token = MOCK_AVAILABLE_TOKEN;
        window.scope = availableScopesString;

        bridge.send.mockImplementation(() =>
          Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
            scope: availableScopesString,
            access_token: MOCK_AVAILABLE_TOKEN,
          })
        );

        const result = await getVkAccessToken({
          scopes: [],
          appId: MOCK_APP_ID,
          ...getErrorCallbacks(),
        });

        expect(result).toEqual(MOCK_AVAILABLE_TOKEN);
        expect(window.scope?.split(',').sort().join(',')).toBe(
          availableScopesString
        );
        expect(window.access_token).toBe(MOCK_AVAILABLE_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(0);
        expectNoErrorsOccurred();
      }
    );
  });

  getScopesCounts().forEach((count) => {
    it(
      'Запрашивается множество скоупов при уже имеющемся пустом множестве скоупов. ' +
        `Количество запрашиваемых скоупов: ${count}`,
      async () => {
        const requestScopes = getRandomScopes(count).sort();
        const requestScopesString = requestScopes.join(',');

        window.access_token = '';
        window.scope = '';

        bridge.send.mockImplementation(() =>
          Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
            scope: requestScopesString,
            access_token: MOCK_TOKEN,
          })
        );

        const result = await getVkAccessToken({
          scopes: requestScopes,
          appId: MOCK_APP_ID,
          ...getErrorCallbacks(),
        });

        expect(result).toEqual(MOCK_TOKEN);
        expect(window.scope?.split(',').sort().join(',')).toBe(
          requestScopesString
        );
        expect(window.access_token).toBe(MOCK_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(1);
        expectNoErrorsOccurred();
      }
    );
  });

  it('Доступное и запрашиваемое множества скоупов пустые', async () => {
    window.access_token = '';
    window.scope = '';

    bridge.send.mockImplementation(() =>
      Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
        scope: '',
        access_token: MOCK_TOKEN,
      })
    );

    const result = await getVkAccessToken({
      scopes: [],
      appId: MOCK_APP_ID,
      ...getErrorCallbacks(),
    });

    expect(result).toEqual(MOCK_TOKEN);
    expect(window.scope).toBe('');
    expect(window.access_token).toBe(MOCK_TOKEN);
    expect(bridge.send).toHaveBeenCalledTimes(1);
    expectNoErrorsOccurred();
  });

  getNonOverlappingScopes().forEach(({ toRequest, available }) => {
    it(
      'Отказ от всех скоупов (множество запрашиваемых не является подмножеством имеющихся) ' +
        `Имеющийся: ${available.join(',')}. Запрашиваемый: ${toRequest.join(
          ','
        )}`,
      async () => {
        const availableScopeString = available.join(',');

        window.access_token = MOCK_AVAILABLE_TOKEN;
        window.scope = availableScopeString;

        const deniedAllError = getUserDeniedCommonError();

        bridge.send.mockImplementation(() => {
          throw deniedAllError;
        });

        const result = await getVkAccessToken({
          scopes: toRequest,
          appId: MOCK_APP_ID,
          ...getErrorCallbacks(),
        });

        expect(result).toEqual(null);
        expect(window.scope).toBe(availableScopeString);
        expect(window.access_token).toBe(MOCK_AVAILABLE_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(1);

        expect(mockOnUserDeniedSomeScopes).not.toHaveBeenCalled();
        expect(mockOnErrorOccurred).not.toHaveBeenCalled();
        expect(mockOnUserDeniedAll).toHaveBeenCalledWith(deniedAllError);
      }
    );
  });

  getRequestToResultScopes().forEach(({ requestScopes, resultScopes }) => {
    it(
      'Отказ от одного или нескольких скоупов. ' +
        `Запрашиваемые: ${requestScopes}. Разрешаемые: ${resultScopes}`,
      async () => {
        window.access_token = MOCK_AVAILABLE_TOKEN;
        window.scope = MOCK_SCOPES_STRING;

        bridge.send.mockImplementation(() =>
          Promise.resolve<ReceiveData<'VKWebAppGetAuthToken'>>({
            access_token: MOCK_TOKEN,
            scope: resultScopes.join(','),
          })
        );

        const result = await getVkAccessToken({
          scopes: requestScopes,
          appId: MOCK_APP_ID,
          ...getErrorCallbacks(),
        });

        expect(result).toEqual(null);
        expect(window.scope).toBe(MOCK_SCOPES_STRING);
        expect(window.access_token).toBe(MOCK_AVAILABLE_TOKEN);
        expect(bridge.send).toHaveBeenCalledTimes(1);

        expect(mockOnUserDeniedSomeScopes).toHaveBeenCalledTimes(1);
        expect(mockOnErrorOccurred).not.toHaveBeenCalled();
        expect(mockOnUserDeniedAll).not.toHaveBeenCalled();
      }
    );
  });

  it('Неизвестная ошибка', async () => {
    window.access_token = MOCK_AVAILABLE_TOKEN;
    window.scope = MOCK_SCOPES_STRING;

    bridge.send.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    const result = await getVkAccessToken({
      scopes: ['docs', 'market', 'video'],
      appId: MOCK_APP_ID,
      ...getErrorCallbacks(),
    });

    expect(result).toEqual(null);
    expect(window.scope).toBe(MOCK_SCOPES_STRING);
    expect(window.access_token).toBe(MOCK_AVAILABLE_TOKEN);
    expect(bridge.send).toHaveBeenCalledTimes(1);

    expect(mockOnUserDeniedSomeScopes).not.toHaveBeenCalled();
    expect(mockOnErrorOccurred).toHaveBeenCalledWith(MOCK_ANY_ERROR);
    expect(mockOnUserDeniedAll).not.toHaveBeenCalled();
  });
});
