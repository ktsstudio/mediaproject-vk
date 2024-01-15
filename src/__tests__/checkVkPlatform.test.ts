import { checkVkPlatform, VK_PLATFORM_CLASSNAME } from '../checkVkPlatform';
import { VkPlatformType } from '../types';

type MvkDeviceUnion = 'android' | 'iphone' | 'ipad' | 'ipod' | 'desktop';

type PlatformToTest =
  | Exclude<VkPlatformType, 'mobile_web' | 'mvk_external'>
  | `mobile_web_${MvkDeviceUnion}`
  | `mvk_external_${MvkDeviceUnion}`;

const clearCurrentBodyClassList = () =>
  document.body.classList.remove(...document.body.classList);

const getExcludedVkPlatformClasses = (toExclude: string[]) => {
  const classesToExclude = new Set(Object.values(toExclude));

  return Object.values(VK_PLATFORM_CLASSNAME).reduce<string[]>(
    (acc, platformClass) =>
      classesToExclude.has(platformClass) ? acc : [...acc, platformClass],
    []
  );
};

const NO_MATTER_USERAGENT = 'NO_MATTER_USERAGENT';
const MOCK_ANDROID_USERAGENT = 'Mock Android Useragent';
const MOCK_IPHONE_USERAGENT = 'Mock iPhone Useragent';
const MOCK_IPAD_USERAGENT = 'Mock iPad Useragent';
const MOCK_IPOD_USERAGENT = 'Mock iPod Useragent';

// https://dev.vk.com/ru/mini-apps/development/launch-params#vk_platform
const vkPlatformCases: Record<
  PlatformToTest,
  {
    vkPlatform: VkPlatformType;
    name: string;
    userAgent: string;
    bodyClassesToExpect: string[];
  }
> = {
  desktop_web: {
    vkPlatform: 'desktop_web',
    name: 'Десктопная версия сайта ВКонтакте',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
  },
  desktop_web_messenger: {
    vkPlatform: 'desktop_web_messenger',
    name: 'Десктопная версия VK Мессенджера (сайт)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
  },
  desktop_app_messenger: {
    vkPlatform: 'desktop_app_messenger',
    name: 'Десктопное приложение VK Мессенджер',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
  },
  mobile_android: {
    vkPlatform: 'mobile_android',
    name: 'Мобильное приложение ВКонтакте для Android',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
  },
  mobile_android_messenger: {
    vkPlatform: 'mobile_android_messenger',
    name: 'Мобильное приложение VK Мессенджер для Android',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
  },
  mobile_ipad: {
    vkPlatform: 'mobile_ipad',
    name: 'Мобильное приложение ВКонтакте для iPadOS',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
  },
  mobile_iphone: {
    vkPlatform: 'mobile_iphone',
    name: 'Мобильное приложение ВКонтакте для iOS',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
  },
  mobile_iphone_messenger: {
    vkPlatform: 'mobile_iphone_messenger',
    name: 'Мобильное приложение VK Мессенджер для iOS',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
  },
  mobile_web_desktop: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в десктопном браузере (mvk)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
  },
  mobile_web_android: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на андроиде',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
  },
  mobile_web_iphone: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айфоне',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  mobile_web_ipad: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айпаде',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  mobile_web_ipod: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айподе',
    userAgent: MOCK_IPOD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  android_external: {
    vkPlatform: 'android_external',
    name: 'Внешнее приложение для Android, на котором запущен миниапп',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
  },
  iphone_external: {
    vkPlatform: 'iphone_external',
    name: 'Внешнее приложение для iOS, на котором запущен миниапп',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  ipad_external: {
    vkPlatform: 'ipad_external',
    name: 'Внешнее приложение для iPadOS, на котором запущен миниапп',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  web_external: {
    vkPlatform: 'web_external',
    name: 'Внешний сайт ВК, запущенный на десктопном браузере',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
  },
  mvk_external_desktop: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на десктопе (mvk)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mvk,
    ],
  },
  mvk_external_android: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на андроиде',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.android,
    ],
  },
  mvk_external_iphone: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPhone',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  mvk_external_ipad: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPad',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
  mvk_external_ipod: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPod',
    userAgent: MOCK_IPOD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mvk,
      VK_PLATFORM_CLASSNAME.ios,
    ],
  },
};

describe('Функция checkVkPlatform', () => {
  let userAgentGetter: jest.SpyInstance<string>;
  let initialBodyClassList: DOMTokenList;

  beforeAll(() => {
    initialBodyClassList = document.body.classList;
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');

    clearCurrentBodyClassList();
  });

  afterEach(() => {
    userAgentGetter.mockClear();
    clearCurrentBodyClassList();
  });

  afterAll(() => {
    document.body.classList.add(...initialBodyClassList);
  });

  Object.values(vkPlatformCases).forEach(
    ({ vkPlatform, name, bodyClassesToExpect, userAgent }) => {
      it(name, () => {
        userAgentGetter.mockReturnValue(userAgent);

        checkVkPlatform(vkPlatform);

        const bodyClasses = [...document.body.classList];

        expect(bodyClasses).toEqual(
          expect.arrayContaining(bodyClassesToExpect)
        );

        expect(bodyClasses).not.toEqual(
          expect.arrayContaining(
            getExcludedVkPlatformClasses(bodyClassesToExpect)
          )
        );
      });
    }
  );

  it('Непередача вк-платформы', () => {
    userAgentGetter.mockReturnValue(NO_MATTER_USERAGENT);

    checkVkPlatform(undefined);

    Object.values(VK_PLATFORM_CLASSNAME).forEach((platformClass) =>
      expect([...document.body.classList]).not.toContain(platformClass)
    );
  });
});
