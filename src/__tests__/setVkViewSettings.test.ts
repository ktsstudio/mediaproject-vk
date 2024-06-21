import originalBridge, { ReceiveData } from '@vkontakte/vk-bridge';

import { setVkViewSettings } from '../setVkViewSettings';
import { SetViewSettingsPropsType, VkPlatformType } from '../types';

import { getRandomVkApiError } from './utils';

jest.mock('@vkontakte/vk-bridge');

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

const BRIDGE_SET_VIEW_SETTINGS_METHOD = 'VKWebAppSetViewSettings';

const VK_PLATFORM_WITH_ALL_VIEW_SETTINGS: VkPlatformType = 'mobile_android';

const VK_PLATFORMS_WITHOUT_VIEW_SETTINGS: VkPlatformType[] = [
  'desktop_web',
  'desktop_web_messenger',
  'desktop_app_messenger',
  'mobile_web',
  'android_external',
  'iphone_external',
  'ipad_external',
  'web_external',
  'mvk_external',
];

// Todo: Когда будет ясно, что mobile_android_messenger поддерживает view settings,
//  включить эту платформу в этот массив
const VK_ANDROID_PLATFORMS_WITH_VIEW_SETTINGS: VkPlatformType[] = [
  'mobile_android',
];

// Todo: Когда будет ясно, что mobile_iphone_messenger поддерживает view settings,
//  включить эту платформу в этот массив
const VK_IOS_PLATFORMS_WITH_VIEW_SETTINGS: VkPlatformType[] = [
  'mobile_iphone',
  'mobile_ipad',
];

const MOCK_VK_VIEW_SETTINGS: SetViewSettingsPropsType = {
  status_bar_style: 'light',
  navigation_bar_color: '#000000',
  action_bar_color: '#000000',
};

const MOCK_BRIDGE_SUCCESS_RESULT: ReceiveData<'VKWebAppSetViewSettings'> = {
  result: true,
};

const MOCK_ANY_ERROR = getRandomVkApiError();

describe('setVkViewSettings', () => {
  afterEach(() => {
    bridge.send.mockClear();
    bridge.supports.mockClear();
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.send.mockImplementation(() => Promise.resolve());
  });

  VK_PLATFORMS_WITHOUT_VIEW_SETTINGS.forEach((platform) => {
    it(`Платформа, не поддерживающая view settings: ${platform}`, async () => {
      const result = await setVkViewSettings(MOCK_VK_VIEW_SETTINGS, platform);

      expect(result).toBe(undefined);
      expect(bridge.send).not.toHaveBeenCalled();
    });
  });

  VK_ANDROID_PLATFORMS_WITH_VIEW_SETTINGS.forEach((platform) => {
    it(`Платформа, поддерживающая все view settings: ${platform}`, async () => {
      bridge.supports.mockImplementation(() => true);

      bridge.send.mockImplementation(() =>
        Promise.resolve(MOCK_BRIDGE_SUCCESS_RESULT)
      );

      const result = await setVkViewSettings(MOCK_VK_VIEW_SETTINGS, platform);

      expect(result).toEqual(MOCK_BRIDGE_SUCCESS_RESULT);
      expect(bridge.send).toHaveBeenCalledWith(
        BRIDGE_SET_VIEW_SETTINGS_METHOD,
        expect.objectContaining(MOCK_VK_VIEW_SETTINGS)
      );
    });
  });

  VK_IOS_PLATFORMS_WITH_VIEW_SETTINGS.forEach((platform) => {
    it(`Платформа, поддерживающая view settings (только окраску статусбара): ${platform}`, async () => {
      bridge.supports.mockImplementation(() => true);

      bridge.send.mockImplementation(() =>
        Promise.resolve(MOCK_BRIDGE_SUCCESS_RESULT)
      );

      const result = await setVkViewSettings(MOCK_VK_VIEW_SETTINGS, platform);

      expect(result).toEqual(MOCK_BRIDGE_SUCCESS_RESULT);

      expect(bridge.send).toBeCalled();

      const [firstArg, secondArg] = bridge.send.mock.calls[0];

      expect(firstArg).toBe(BRIDGE_SET_VIEW_SETTINGS_METHOD);

      expect(secondArg).toEqual<
        Pick<SetViewSettingsPropsType, 'status_bar_style'>
      >({
        status_bar_style: MOCK_VK_VIEW_SETTINGS.status_bar_style,
      });
    });
  });

  it('Неизвестная ошибка bridge.supports', async () => {
    bridge.supports.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    bridge.send.mockImplementation(() =>
      Promise.resolve(MOCK_BRIDGE_SUCCESS_RESULT)
    );

    const result = await setVkViewSettings(
      MOCK_VK_VIEW_SETTINGS,
      VK_PLATFORM_WITH_ALL_VIEW_SETTINGS
    );

    expect(result).toEqual(MOCK_ANY_ERROR);
    expect(bridge.send).not.toHaveBeenCalled();
  });

  it('Неизвестная ошибка bridge.send', async () => {
    bridge.supports.mockImplementation(() => true);

    bridge.send.mockImplementation(() => {
      throw MOCK_ANY_ERROR;
    });

    const result = await setVkViewSettings(
      MOCK_VK_VIEW_SETTINGS,
      VK_PLATFORM_WITH_ALL_VIEW_SETTINGS
    );

    expect(result).toEqual(MOCK_ANY_ERROR);
    expect(bridge.send).toHaveBeenCalled();
  });
});
