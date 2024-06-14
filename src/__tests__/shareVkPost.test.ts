import { api as originalApi } from '@ktsstudio/mediaproject-utils';
import { ApiResponse, UrlConfigType } from '@ktsstudio/mediaproject-utils';
import originalBridge, {
  ErrorData,
  PersonalAuthScope,
  RequestIdProp,
  RequestProps,
  RequestPropsMap,
} from '@vkontakte/vk-bridge';
import { ReceiveData } from '@vkontakte/vk-bridge';
import { when } from 'jest-when';

import { callVkApi as originalCallVkApi } from '../callVkApi';
import { shareVkPost, shareVkPostWithUpload } from '../shareVkPost';
import {
  CallVkApiPropsType,
  CallVkApiResponseType,
  GetVkAccessTokenParamsType,
  SaveVkWallPhotoResponseType,
  ShareVkPostPropsType,
  ShareVkPostWithUploadParamsType,
  UploadFromApiToVkResponseType,
} from '../types';

import {
  getRandomVkApiError,
  getRandomVkAuthError,
  getRandomVkClientError,
  getRandomVkErrorEachType,
  getUserDeniedCommonError,
  randomNumberUpTo,
  randomString,
  range,
} from './utils';

jest.mock('../callVkApi');
jest.mock('@ktsstudio/mediaproject-utils');
jest.mock('@vkontakte/vk-bridge');

const api = originalApi as jest.MockedFn<typeof originalApi>;
const callVkApi = originalCallVkApi as jest.MockedFn<typeof originalCallVkApi>;
const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

// Удобный для тестирования формат аттачей: массив аттачей (массив строк)
// и объединённая строка с аттачами
type ShareVkPostAttachmentData = {
  array: string[];
  stringValue: Exclude<ShareVkPostPropsType['attachments'], undefined>;
};

const getWallPhotoAttachment = (ownerId: number, wallImageId: number): string =>
  `photo${ownerId}_${wallImageId}`;

const PHOTOS_VK_SCOPE: PersonalAuthScope = 'photos';

const getMockAttachments = (): ShareVkPostAttachmentData => {
  const array = range(3).map(() => randomString(10));

  return {
    array,
    stringValue: array.join(','),
  };
};

const getMockSharingProps = (
  attachments: ShareVkPostPropsType['attachments'] = undefined
): ShareVkPostPropsType => ({
  lat: randomNumberUpTo(1000),
  signed: false,
  close_comments: false,
  services: randomString(10),
  long: randomNumberUpTo(1000),
  owner_id: randomNumberUpTo(1000),
  publish_date: randomNumberUpTo(1000),
  place_id: randomNumberUpTo(1000),
  link_image: randomString(10),
  link_title: randomString(10),
  link_button: randomString(10),
  copyright: randomString(10),
  message: randomString(10),
  friends_only: false,
  attachments,
});

const getMockSharingWithUploadProps = ({
  postProps = getMockSharingProps(),
  accessToken,
  onUserDeniedAccess,
  onErrorOccurred,
}: Partial<
  Pick<
    ShareVkPostWithUploadParamsType,
    'postProps' | 'accessToken' | 'onUserDeniedAccess' | 'onErrorOccurred'
  >
> = {}): ShareVkPostWithUploadParamsType => ({
  appId: randomNumberUpTo(1000),
  file: new File([new Blob()], 'file'),
  apiUploadUrl: { url: randomString(10), method: 'POST' },
  userId: randomNumberUpTo(10),
  postProps,
  accessToken,
  onUserDeniedAccess,
  onErrorOccurred,
});

const MOCK_RANDOM_KTS_API_ERROR_DATA = randomString(10);
const MOCK_RANDOM_KTS_API_ERROR = randomString(10);

const MOCK_SUCCESS_POST_RESULT: ReceiveData<'VKWebAppShowWallPostBox'> = {
  post_id: randomNumberUpTo(1000),
};

const MOCK_GET_UPLOAD_SERVER_RESPONSE: CallVkApiResponseType<{
  upload_url: string;
}> = {
  response: {
    upload_url: randomString(10),
  },
};

const MOCK_KTS_API_RESPONSE: UploadFromApiToVkResponseType = {
  response: {
    hash: randomString(10),
    photo: randomString(10),
    // Предполагается, что от ВК приходит число, но в виде строки
    server: String(randomNumberUpTo(1000)),
  },
};

const MOCK_SAVE_WALL_PHOTO_RESPONSE: SaveVkWallPhotoResponseType = {
  response: range(3).map(() => ({
    id: randomNumberUpTo(100),
    owner_id: randomNumberUpTo(100),
    album_id: randomNumberUpTo(100),
  })),
};

const mockCallVkApiResolveValue = ({
  getWallUploadServer = MOCK_GET_UPLOAD_SERVER_RESPONSE,
  saveWallPhoto = MOCK_SAVE_WALL_PHOTO_RESPONSE,
}: {
  getWallUploadServer?: CallVkApiResponseType<{
    upload_url: string;
  }>;
  saveWallPhoto?: SaveVkWallPhotoResponseType;
} = {}): void => {
  callVkApi.mockImplementation(({ method }) => {
    switch (method) {
      case 'photos.getWallUploadServer':
        return Promise.resolve(getWallUploadServer);
      case 'photos.saveWallPhoto':
      default:
        return Promise.resolve(saveWallPhoto);
    }
  });
};

const mockVkBridgeResolveWhenPost = (
  mock: ReceiveData<'VKWebAppShowWallPostBox'> = MOCK_SUCCESS_POST_RESULT
): void => {
  when(bridge.send)
    .calledWith('VKWebAppShowWallPostBox', expect.anything())
    .mockResolvedValue(mock);
};

const mockVkBridgeRejectWhenPost = (mock: ErrorData): void => {
  when(bridge.send)
    .calledWith('VKWebAppShowWallPostBox', expect.anything())
    .mockRejectedValue(mock);
};

const MOCK_CLIENT_ERROR = getRandomVkClientError();
const MOCK_AUTH_ERROR = getRandomVkAuthError();
const MOCK_API_ERROR = getRandomVkApiError();

const ANY_ERROR = randomString(10);

/**
 * Проверить, что определённые методы не были вызваны
 */
const expectMethodsNotToBeCalled = (notToBeCalled: {
  getWallUploadServer: boolean;
  ktsApi: boolean;
  saveWallPhoto: boolean;
  VKWebAppShowWallPostBox: boolean;
}): void => {
  const callVkApiGetWallUploadServerParams = () =>
    expect.objectContaining<Partial<CallVkApiPropsType>>({
      method: 'photos.getWallUploadServer',
    });

  if (notToBeCalled.getWallUploadServer) {
    expect(callVkApi).not.toHaveBeenCalledWith(
      callVkApiGetWallUploadServerParams()
    );
  } else {
    expect(callVkApi).toHaveBeenCalledWith(
      callVkApiGetWallUploadServerParams()
    );
  }

  if (notToBeCalled.ktsApi) {
    expect(api).not.toHaveBeenCalled();
  } else {
    expect(api).toHaveBeenCalled();
  }

  const callVkApiSaveWallPhotoParams = () =>
    expect.objectContaining<Partial<CallVkApiPropsType>>({
      method: 'photos.saveWallPhoto',
    });

  if (notToBeCalled.saveWallPhoto) {
    expect(callVkApi).not.toHaveBeenCalledWith(callVkApiSaveWallPhotoParams());
  } else {
    expect(callVkApi).toHaveBeenCalledWith(callVkApiSaveWallPhotoParams());
  }

  if (notToBeCalled.VKWebAppShowWallPostBox) {
    expect(bridge.send).not.toHaveBeenCalledWith('VKWebAppShowWallPostBox');
  } else {
    expect(bridge.send).toHaveBeenCalledWith('VKWebAppShowWallPostBox');
  }
};

describe('Функция shareVkPost', () => {
  beforeEach(() => {
    bridge.send.mockResolvedValue(undefined);
  });

  afterEach(() => {
    bridge.send.mockClear();
  });

  it('Вызывается VK Bridge, метод VKWebAppShowWallPostBox, передаются параметры шеринга', async () => {
    bridge.send.mockResolvedValue(MOCK_SUCCESS_POST_RESULT);

    const mockSharingProps = getMockSharingProps(
      getMockAttachments().stringValue
    );

    const result = await shareVkPost(mockSharingProps);

    expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
    expect(bridge.send).toBeCalledWith(
      'VKWebAppShowWallPostBox',
      mockSharingProps
    );
  });

  describe('Произошла ошибка', () => {
    getRandomVkErrorEachType().forEach((error) => {
      it(`Ошибка от ВК, не является отказом пользователя. Тип ошибки: ${error.error_type}`, async () => {
        bridge.send.mockRejectedValue(error);

        const result = await shareVkPost(getMockSharingProps());

        expect(result).toBe(error);
      });
    });

    it('Ошибка от ВК, отказ пользователя', async () => {
      bridge.send.mockRejectedValue(getUserDeniedCommonError());

      const result = await shareVkPost(getMockSharingProps());

      expect(result).toBe(undefined);
    });
  });
});

describe('Функция shareVkPostWithUpload', () => {
  beforeEach(() => {
    mockVkBridgeResolveWhenPost();
    callVkApi.mockResolvedValue({
      response: true,
    });
    api.mockResolvedValue({
      response: true,
    });
  });

  afterEach(() => {
    bridge.send.mockClear();
    callVkApi.mockClear();
    api.mockClear();
  });

  describe('Этап получения сервера для загрузки фото', () => {
    it('Вызывается метод VK API photos.getWallUploadServer', async () => {
      mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
      mockCallVkApiResolveValue();
      api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

      const result = await shareVkPostWithUpload(
        getMockSharingWithUploadProps()
      );

      expect(callVkApi).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining<CallVkApiPropsType>({
          method: 'photos.getWallUploadServer',
          getAccessTokenParams: expect.anything(),
        })
      );
      expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
    });

    it(
      'В callVkApi передаётся токен, параметры получения токена. ' +
        'В качестве колбэка на отказ от всех скоупов и отказ от части скоупов ' +
        'передаётся функция-аргумент onUserDeniedAccess',
      async () => {
        mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
        mockCallVkApiResolveValue();
        api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

        const { accessToken, onUserDeniedAccess, appId, ...rest } =
          getMockSharingWithUploadProps({ accessToken: randomString(10) });

        const result = await shareVkPostWithUpload({
          accessToken,
          appId,
          onUserDeniedAccess,
          ...rest,
        });

        expect(callVkApi).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining<CallVkApiPropsType>({
            method: 'photos.getWallUploadServer',
            accessToken,
            getAccessTokenParams:
              expect.objectContaining<GetVkAccessTokenParamsType>({
                appId,
                scopes: expect.arrayContaining([PHOTOS_VK_SCOPE]),
                onUserDeniedSomeScopes: onUserDeniedAccess,
                onUserDeniedAll: onUserDeniedAccess,
              }),
          })
        );
        expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      }
    );

    /**
     * Тестирование кейса с возвращением ошибки из функции callVkApi
     * на этапе получения сервера для загрузки картинки
     */
    const testCallVkApiReturnError = (error: ErrorData) => {
      it(
        'Ошибка возвращается из функции и передаётся' +
          'в функцию-аргумент onErrorOccurred',
        async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          mockCallVkApiResolveValue({
            getWallUploadServer: error,
          });
          api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

          const spyOnErrorOccurred = jest.fn();

          const result = await shareVkPostWithUpload({
            ...getMockSharingWithUploadProps(),
            onErrorOccurred: spyOnErrorOccurred,
          });

          expect(result).toBe(error);
          expect(spyOnErrorOccurred).toBeCalledWith(error);
        }
      );

      it(
        'Выполнение не доходит до обращения к бэкенду KTS, ' +
          'методу photos.saveWallPhoto и методу VKWebAppShowWallPostBox',
        async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          mockCallVkApiResolveValue({
            getWallUploadServer: error,
          });
          api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

          const result = await shareVkPostWithUpload(
            getMockSharingWithUploadProps()
          );

          expect(result).toBe(error);

          expectMethodsNotToBeCalled({
            getWallUploadServer: false,
            saveWallPhoto: true,
            ktsApi: true,
            VKWebAppShowWallPostBox: true,
          });
        }
      );
    };

    describe('Утилита callVkApi возвращает ошибку типа client_error', () => {
      testCallVkApiReturnError(MOCK_CLIENT_ERROR);
    });

    describe('Утилита callVkApi возвращает ошибку типа auth_error', () => {
      testCallVkApiReturnError(MOCK_AUTH_ERROR);
    });

    describe('Утилита callVkApi возвращает ошибку типа api_error', () => {
      testCallVkApiReturnError(MOCK_API_ERROR);
    });
  });
  // Конец: Этап получения сервера для загрузки фото

  describe('Этап отправки адреса ВК-сервера на бэкенд KTS для загрузки. Все предыдущие этапы выполнены успешно', () => {
    it(
      'Используется утилита api из mediaproject-utils. ' +
        'В утилиту передаются эндпоинт API KTS, файл, адрес ВК-сервера, ' +
        'флаг об использовании FormData',
      async () => {
        mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
        mockCallVkApiResolveValue({
          getWallUploadServer: MOCK_GET_UPLOAD_SERVER_RESPONSE,
        });
        api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

        const { apiUploadUrl, file, ...restParams } =
          getMockSharingWithUploadProps();

        const result = await shareVkPostWithUpload({
          apiUploadUrl,
          file,
          ...restParams,
        });

        expect(api).toBeCalledWith(
          // Первый аргумент — эндпоинт
          expect.objectContaining<UrlConfigType>(apiUploadUrl),

          // Второй аргумент — payload, который должен соответствовать заданной структуре
          expect.objectContaining({
            image: file,
            server_url: MOCK_GET_UPLOAD_SERVER_RESPONSE.response?.upload_url,
          }),

          // Третий аргумент — конфиг для axios. Не имеет значения
          expect.anything(),

          // Четвёртый аргумент — флаг об использовании FormData
          true
        );
        expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      }
    );

    describe('Ответ бэкенда KTS, считающийся ошибкой', () => {
      const testKtsApiErrorReturn = (resolvedValue: ApiResponse) => {
        it('Данные об ошибке передаются в функцию-аргумент onErrorOccurred, а результатом выполнения утилиты является undefined', async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          mockCallVkApiResolveValue();
          api.mockResolvedValue(resolvedValue);

          const spyOnErrorOccurred = jest.fn();

          const result = await shareVkPostWithUpload({
            ...getMockSharingWithUploadProps(),
            onErrorOccurred: spyOnErrorOccurred,
          });

          expect(result).toBe(undefined);
          expect(spyOnErrorOccurred).toBeCalledWith(
            MOCK_RANDOM_KTS_API_ERROR,
            MOCK_RANDOM_KTS_API_ERROR_DATA
          );
        });

        it('Выполнение не доходит до обращения к методу photos.saveWallPhoto и методу VKWebAppShowWallPostBox', async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          mockCallVkApiResolveValue();
          api.mockResolvedValue(resolvedValue);

          const result = await shareVkPostWithUpload(
            getMockSharingWithUploadProps()
          );

          expect(result).toBe(undefined);
          expectMethodsNotToBeCalled({
            getWallUploadServer: false,
            ktsApi: false,
            saveWallPhoto: true,
            VKWebAppShowWallPostBox: true,
          });
        });
      };

      describe('Ответ пустой', () => {
        testKtsApiErrorReturn({
          response: undefined,
          error: MOCK_RANDOM_KTS_API_ERROR,
          errorData: MOCK_RANDOM_KTS_API_ERROR_DATA,
        });
      });

      describe('Вернулась явная ошибка', () => {
        testKtsApiErrorReturn({
          response: 'DO_NOT_MATTER',
          error: MOCK_RANDOM_KTS_API_ERROR,
          errorData: MOCK_RANDOM_KTS_API_ERROR_DATA,
        });
      });
    });
  });
  // Конец: Этап отправки адреса ВК-сервера на бэкенд KTS для загрузки

  describe('Этап сохранения картинки в альбом стены пользователя. Все предыдущие этапы выполнены успешно', () => {
    it(
      'Вызывается VK API с методом photos.saveWallPhoto. ' +
        'В VK API передаются данные для загрузки картинки, полученные ранее из KTS API ' +
        'поле server приводится к числу',
      async () => {
        mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
        mockCallVkApiResolveValue();

        const mockHash = randomString(10);
        const mockPhoto = randomString(10);
        // Предполагается, что ВК API отдаёт число в виде строки
        const mockServer = String(randomNumberUpTo(1000));

        const mockKtsApiResponse: UploadFromApiToVkResponseType = {
          response: {
            hash: mockHash,
            photo: mockPhoto,
            server: mockServer,
          },
        };

        api.mockResolvedValue(mockKtsApiResponse);

        const { apiUploadUrl, file, userId, ...restParams } =
          getMockSharingWithUploadProps();

        const result = await shareVkPostWithUpload({
          apiUploadUrl,
          file,
          userId,
          ...restParams,
        });

        expect(callVkApi).toHaveBeenCalledWith(
          expect.objectContaining<Partial<CallVkApiPropsType>>({
            method: 'photos.saveWallPhoto',
            params: expect.objectContaining({
              hash: mockHash,
              photo: mockPhoto,
              server: Number(mockServer),
              user_id: userId,
            }),
          })
        );
        expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      }
    );

    describe('В VK API передаётся токен доступа', () => {
      it('Если токен уже был передан, используется он', async () => {
        mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
        mockCallVkApiResolveValue();
        api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

        const { accessToken, ...restParams } = getMockSharingWithUploadProps({
          accessToken: randomString(10),
        });

        const result = await shareVkPostWithUpload({
          accessToken,
          ...restParams,
        });

        expect(callVkApi).toHaveBeenCalledWith(
          expect.objectContaining<Partial<CallVkApiPropsType>>({
            method: 'photos.saveWallPhoto',
            accessToken,
          })
        );
        expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      });

      it.todo(
        'Если изначально передан протухший токен, используется обновлённый токен'
      );
      // it('Если изначально передан протухший токен, используется обновлённый токен', async () => {
      //   mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
      //   mockCallVkApiResolveValue();
      //   api.mockResolvedValue(MOCK_KTS_API_RESPONSE);
      //
      //   const initialAccessToken = randomString(10);
      //
      //   const result = await shareVkPostWithUpload({
      //     ...getMockSharingWithUploadProps(),
      //     accessToken: initialAccessToken,
      //   });
      //
      //   // С каким конфигом в последний раз вызывался метод photos.saveWallPhoto
      //   const callParams =
      //     callVkApi.mock.calls.reduce<CallVkApiPropsType | null>(
      //       (lastCallSaveWallPhotoParams, [callVkApiParams]) => {
      //         if (callVkApiParams.method === 'photos.saveWallPhoto') {
      //           return callVkApiParams;
      //         }
      //
      //         return lastCallSaveWallPhotoParams;
      //       },
      //       null
      //     );
      //
      //   expect(callParams).toBeTruthy();
      //   expect(callParams?.accessToken).toBeTruthy();
      //   // Todo: Пока из-за проблемы, описанной в issue, это условие не срабатывает
      //   //  https://github.com/ktsstudio/mediaproject-vk/issues/23
      //   expect(callParams?.accessToken).not.toBe(initialAccessToken);
      //   expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      // });
    });

    describe('Ответ VK API, считающийся ошибкой', () => {
      const testSaveWallPhotoReturnError = (
        callVkApiResponse: SaveVkWallPhotoResponseType
      ) => {
        it(
          'Ответ VK API попадает в функцию-аргумент onErrorOccurred, ' +
            'утилита возвращает undefined',
          async () => {
            mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
            mockCallVkApiResolveValue({
              saveWallPhoto: callVkApiResponse,
            });
            api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

            const spyOnErrorOccurred = jest.fn();

            const result = await shareVkPostWithUpload({
              ...getMockSharingWithUploadProps(),
              onErrorOccurred: spyOnErrorOccurred,
            });

            expect(spyOnErrorOccurred).toBeCalledWith(callVkApiResponse);
            expect(result).toBe(undefined);
          }
        );

        it('Выполнение не доходит до обращения к методу VKWebAppShowWallPostBox', async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          mockCallVkApiResolveValue({
            saveWallPhoto: callVkApiResponse,
          });
          api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

          const result = await shareVkPostWithUpload(
            getMockSharingWithUploadProps()
          );

          expect(result).toBe(undefined);
          expectMethodsNotToBeCalled({
            getWallUploadServer: false,
            ktsApi: false,
            saveWallPhoto: false,
            VKWebAppShowWallPostBox: true,
          });
        });
      };

      getRandomVkErrorEachType().forEach((vkError) => {
        describe(`Вернулась ошибка из VK API. Тип ошибки: ${vkError.error_type}`, () => {
          testSaveWallPhotoReturnError(vkError);
        });
      });

      describe('Вернулась пустота в ответе в поле response', () => {
        testSaveWallPhotoReturnError({
          response: undefined,
        });
      });

      describe('Вернулся пустой массив с данными о загруженных картинках', () => {
        testSaveWallPhotoReturnError({
          response: [],
        });
      });
    });
  });
  // Конец: Этап сохранения картинки в альбом стены пользователя

  describe('Этап шеринга картинки в пост. Все предыдущие этапы выполнены успешно', () => {
    it(
      'Переданные изначально параметры шеринга (кроме attachments) ' +
        'передаются в метод VKWebAppShowWallPostBox',
      async () => {
        mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
        mockCallVkApiResolveValue();
        api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

        const mockSharingProps = getMockSharingProps();

        const result = await shareVkPostWithUpload({
          ...getMockSharingWithUploadProps(),
          postProps: mockSharingProps,
        });

        expect(bridge.send).toBeCalledWith(
          'VKWebAppShowWallPostBox',
          expect.objectContaining<ShareVkPostPropsType>({
            ...mockSharingProps,
            attachments: expect.anything(),
          })
        );
        expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
      }
    );

    // Тестирование тест-кейсов с передачей и непередачей аттачей
    const testShareVkPostAttachmentPassing = async (
      attachmentToPass?: ShareVkPostAttachmentData
    ) => {
      mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
      api.mockResolvedValue(MOCK_KTS_API_RESPONSE);

      const mockWallImageId = randomNumberUpTo(1000);
      const mockWallAlbumId = randomNumberUpTo(1000);
      const mockWallOwnerId = randomNumberUpTo(1000);

      mockCallVkApiResolveValue({
        saveWallPhoto: {
          response: [
            {
              id: mockWallImageId,
              album_id: mockWallAlbumId,
              owner_id: mockWallOwnerId,
            },
          ],
        },
      });

      const result = await shareVkPostWithUpload({
        ...getMockSharingWithUploadProps(),
        postProps: getMockSharingProps(attachmentToPass?.stringValue),
      });

      const wallPhotoMockAttachment = getWallPhotoAttachment(
        mockWallOwnerId,
        mockWallImageId
      );

      // Получить конфиг последнего вызова VK Bridge с методом VKWebAppShowWallPostBox
      const bridgeCallConfig = bridge.send.mock.calls.reduce<
        (RequestProps<keyof RequestPropsMap> & RequestIdProp) | null
      >((lastBridgeCallConfig, [methodName, callConfig]) => {
        if (methodName === 'VKWebAppShowWallPostBox') {
          return callConfig ?? null;
        }

        return lastBridgeCallConfig ?? null;
      }, null);

      if (!bridgeCallConfig) {
        fail('Конфиг вызова VK Bridge не должен быть пустым');
      }

      const resultAttachments = (bridgeCallConfig as ShareVkPostPropsType)
        .attachments;

      if (!resultAttachments) {
        fail('Аттачи не должны быть пустыми');
      }

      const resultAttachmentsArray = resultAttachments.split(',');

      expect(
        [...(attachmentToPass?.array ?? []), wallPhotoMockAttachment]
          .sort()
          .join(',')
      ).toEqual(resultAttachmentsArray.sort().join(','));

      expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
    };

    it('Картинка со стены добавляется к переданным attachments, отправляемым в VKWebAppShowWallPostBox', async () => {
      testShareVkPostAttachmentPassing(getMockAttachments());
    });

    it(
      'Если дополнительные attachments не переданы, ' +
        'в параметр attachments VKWebAppShowWallPostBox передаётся только картинка со стены пользователя',
      () => {
        testShareVkPostAttachmentPassing(undefined);
      }
    );
    describe(
      'Из функции возвращается результат выполнения VK Bridge ' +
        'с методом VKWebAppShowWallPostBox',
      () => {
        it('Успешный результат', async () => {
          mockVkBridgeResolveWhenPost(MOCK_SUCCESS_POST_RESULT);
          api.mockResolvedValue(MOCK_KTS_API_RESPONSE);
          mockCallVkApiResolveValue();

          const result = await shareVkPostWithUpload(
            getMockSharingWithUploadProps()
          );

          expect(result).toBe(MOCK_SUCCESS_POST_RESULT);
        });

        describe('Произошла ошибка', () => {
          getRandomVkErrorEachType().forEach((vkError) => {
            it(
              'Ошибка от ВК, не является отказом пользователя. ' +
                'Ошибка возвращается как результат выполнения утилиты. ' +
                `Тип ошибки: ${vkError.error_type}`,
              async () => {
                mockVkBridgeRejectWhenPost(vkError);
                api.mockResolvedValue(MOCK_KTS_API_RESPONSE);
                mockCallVkApiResolveValue();

                const result = await shareVkPostWithUpload(
                  getMockSharingWithUploadProps()
                );

                expect(result).toBe(vkError);
                expect(bridge.send).toBeCalled();
              }
            );
          });

          it('Ошибка от ВК, отказ пользователя', async () => {
            const userDeniedError = getUserDeniedCommonError();

            mockVkBridgeRejectWhenPost(userDeniedError);
            api.mockResolvedValue(MOCK_KTS_API_RESPONSE);
            mockCallVkApiResolveValue();

            const result = await shareVkPostWithUpload(
              getMockSharingWithUploadProps()
            );

            expect(result).toBe(undefined);
            expect(bridge.send).toBeCalled();
          });
        });
      }
    );
  });
  // Конец: Этап шеринга картинки в пост

  describe('Обработка ошибки, необработанной на каком-либо этапе', () => {
    it('Выброс ошибки, не связанной с отказом пользователя', async () => {
      mockCallVkApiResolveValue();
      mockVkBridgeResolveWhenPost();

      // Несильно важно, где именно выкидывается ошибка.
      // Важнее то, что она не обработана на этапах
      api.mockRejectedValue(ANY_ERROR);

      const spyOnErrorOccurred = jest.fn();

      const result = await shareVkPostWithUpload({
        ...getMockSharingWithUploadProps(),
        onErrorOccurred: spyOnErrorOccurred,
      });

      expect(result).toBe(ANY_ERROR);
      expect(spyOnErrorOccurred).toBeCalledWith(ANY_ERROR);
    });

    it('Выброс ошибки, связанной с отказом пользователя', async () => {
      mockCallVkApiResolveValue();
      mockVkBridgeResolveWhenPost();

      const userDeniedError = getUserDeniedCommonError();

      // Несильно важно, где именно выкидывается ошибка.
      // Важнее то, что она не обработана на этапах
      api.mockRejectedValue(userDeniedError);

      const spyOnErrorOccurred = jest.fn();

      const result = await shareVkPostWithUpload({
        ...getMockSharingWithUploadProps(),
        onErrorOccurred: spyOnErrorOccurred,
      });

      expect(result).toBe(userDeniedError);
      expect(spyOnErrorOccurred).not.toHaveBeenCalledWith(userDeniedError);
    });
  });
});
