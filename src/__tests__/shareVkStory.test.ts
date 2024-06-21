import originalBridge, { ReceiveData } from '@vkontakte/vk-bridge';

import { userDeniedReasons } from '../checkVkUserDenied';
import { shareVkStory } from '../shareVkStory';
import { ShareVkStoryPropsType } from '../types';

import { getRandomVkApiError, getUserDeniedCommonError } from './utils';

jest.mock('@vkontakte/vk-bridge');

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

const VK_BRIDGE_SHARE_STORY_METHOD = 'VKWebAppShowStoryBox';

const MOCK_ANY_ERROR = getRandomVkApiError();

const MOCK_STORY_BACKGROUND_TYPE = 'none';

const MOCK_STORY_LOCKED_PARAM = true;

const MOCK_STORY_BLOB = 'MOCK_STORY_BLOB';

const MOCK_STORY_URL = 'MOCK_STORY_URL';

const MOCK_STORY_ATTACHMENT: ShareVkStoryPropsType['attachment'] = {
  type: 'audio',
  url: 'MOCK_STORY_ATTACHMENT.url',
  text: 'MOCK_STORY_ATTACHMENT.text',
  id: 0,
  owner_id: 0,
  access_key: 'MOCK_STORY_ATTACHMENT.access_key',
};

const getMockShareStoryParams = (
  props: { url: string } | { blob: string }
): ShareVkStoryPropsType => ({
  attachment: MOCK_STORY_ATTACHMENT,
  locked: MOCK_STORY_LOCKED_PARAM,
  background_type: MOCK_STORY_BACKGROUND_TYPE,
  ...props,
});

const MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT: ReceiveData<'VKWebAppShowStoryBox'> =
  {
    result: true,
  };

describe('Функция shareVkStory', () => {
  afterEach(() => {
    bridge.send.mockClear();
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.send.mockImplementation(() => Promise.resolve());
  });

  it('Успешное выполнение, источник картинки — URL', async () => {
    bridge.send.mockImplementation(() =>
      Promise.resolve(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT)
    );

    const result = await shareVkStory(
      getMockShareStoryParams({ url: MOCK_STORY_URL })
    );

    expect(result).toEqual(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT);

    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_SHARE_STORY_METHOD,
      expect.objectContaining({
        url: MOCK_STORY_URL,
      })
    );

    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_SHARE_STORY_METHOD,
      expect.not.objectContaining({
        blob: expect.anything(),
      })
    );
  });

  it('Успешное выполнение, источник картинки — BLOB', async () => {
    bridge.send.mockImplementation(() =>
      Promise.resolve(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT)
    );

    const result = await shareVkStory(
      getMockShareStoryParams({ blob: MOCK_STORY_BLOB })
    );

    expect(result).toEqual(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT);

    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_SHARE_STORY_METHOD,
      expect.objectContaining({
        blob: MOCK_STORY_BLOB,
      })
    );

    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_SHARE_STORY_METHOD,
      expect.not.objectContaining({
        url: expect.anything(),
      })
    );
  });

  it('Все параметры, кроме источника картинки, передаются в бридж', async () => {
    bridge.send.mockImplementation(() =>
      Promise.resolve(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT)
    );

    const result = await shareVkStory({
      url: MOCK_STORY_URL,
      attachment: MOCK_STORY_ATTACHMENT,
      locked: MOCK_STORY_LOCKED_PARAM,
      background_type: MOCK_STORY_BACKGROUND_TYPE,
    });

    expect(result).toEqual(MOCK_SHARE_STORY_BRIDGE_SUCCESS_RESULT);

    expect(bridge.send).toBeCalledWith(
      VK_BRIDGE_SHARE_STORY_METHOD,
      expect.objectContaining<ShareVkStoryPropsType>({
        url: MOCK_STORY_URL,
        locked: MOCK_STORY_LOCKED_PARAM,
        background_type: MOCK_STORY_BACKGROUND_TYPE,
        attachment: MOCK_STORY_ATTACHMENT,
      })
    );
  });

  [...userDeniedReasons].forEach((reason) => {
    it(`Отказ пользователя, причина ошибки: "${reason}"`, async () => {
      bridge.send.mockImplementation(() => {
        throw getUserDeniedCommonError({ reason });
      });

      const result = await shareVkStory(
        getMockShareStoryParams({ url: MOCK_STORY_URL })
      );

      expect(bridge.send).toBeCalledTimes(1);
      expect(result).toBe(undefined);
    });
  });

  it('Неизвестная ошибка', async () => {
    bridge.send.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    const result = await shareVkStory(
      getMockShareStoryParams({ url: MOCK_STORY_URL })
    );

    expect(bridge.send).toBeCalledTimes(1);
    expect(result).toBe(MOCK_ANY_ERROR);
  });
});
