import { checkVkPlatform, VK_PLATFORM_CLASSNAME } from '../checkVkPlatform';
import { DeviceInfo, VkPlatformType } from '../types';

type DeviceUnion = 'android' | 'iphone' | 'ipad' | 'ipod' | 'desktop';

type PlatformToTest =
  | Exclude<
      VkPlatformType,
      'mobile_web' | 'mvk_external' | 'desktop_web_messenger'
    >
  | `mobile_web_${DeviceUnion}`
  | `mvk_external_${DeviceUnion}`
  | `desktop_web_messenger_on_${DeviceUnion}`;

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
    deviceInfoToExpect: DeviceInfo;
  }
> = {
  desktop_web: {
    vkPlatform: 'desktop_web',
    name: 'Десктопная версия сайта ВКонтакте',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: false,
      isWeb: true,
      isMessenger: false,
    },
  },
  desktop_web_messenger_on_desktop: {
    vkPlatform: 'desktop_web_messenger',
    name: 'Десктопная версия VK Мессенджера (сайт)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.desktop,
      VK_PLATFORM_CLASSNAME.web,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: false,
      isWeb: true,
      isMessenger: true,
    },
  },
  desktop_web_messenger_on_android: {
    vkPlatform: 'desktop_web_messenger',
    name: 'ВК Мессенджер в вебе на Android',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: true,
      isMessenger: true,
    },
  },
  desktop_web_messenger_on_iphone: {
    vkPlatform: 'desktop_web_messenger',
    name: 'ВК Мессенджер в вебе на iPhone',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: true,
    },
  },
  desktop_web_messenger_on_ipad: {
    vkPlatform: 'desktop_web_messenger',
    name: 'ВК Мессенджер в вебе на iPad',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: true,
    },
  },
  desktop_web_messenger_on_ipod: {
    vkPlatform: 'desktop_web_messenger',
    name: 'ВК Мессенджер в вебе на iPod',
    userAgent: MOCK_IPOD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: true,
    },
  },
  desktop_app_messenger: {
    vkPlatform: 'desktop_app_messenger',
    name: 'Десктопное приложение VK Мессенджер',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: false,
      isWeb: false,
      isMessenger: true,
    },
  },
  mobile_android: {
    vkPlatform: 'mobile_android',
    name: 'Мобильное приложение ВКонтакте для Android',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  mobile_android_messenger: {
    vkPlatform: 'mobile_android_messenger',
    name: 'Мобильное приложение VK Мессенджер для Android',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: false,
      isMessenger: true,
    },
  },
  mobile_ipad: {
    vkPlatform: 'mobile_ipad',
    name: 'Мобильное приложение ВКонтакте для iPadOS',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  mobile_iphone: {
    vkPlatform: 'mobile_iphone',
    name: 'Мобильное приложение ВКонтакте для iOS',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  mobile_iphone_messenger: {
    vkPlatform: 'mobile_iphone_messenger',
    name: 'Мобильное приложение VK Мессенджер для iOS',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.ios,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: false,
      isMessenger: true,
    },
  },
  mobile_web_desktop: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в десктопном браузере (m.vk.com)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mobile_web_android: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на андроиде',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mobile_web_iphone: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айфоне',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mobile_web_ipad: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айпаде',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mobile_web_ipod: {
    vkPlatform: 'mobile_web',
    name: 'Мобильная версия сайта ВКонтакте, открытая в мобильном браузере на айподе',
    userAgent: MOCK_IPOD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  android_external: {
    vkPlatform: 'android_external',
    name: 'Внешнее приложение для Android, на котором запущен миниапп',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  iphone_external: {
    vkPlatform: 'iphone_external',
    name: 'Внешнее приложение для iOS, на котором запущен миниапп',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  ipad_external: {
    vkPlatform: 'ipad_external',
    name: 'Внешнее приложение для iPadOS, на котором запущен миниапп',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: false,
      isMessenger: false,
    },
  },
  web_external: {
    vkPlatform: 'web_external',
    name: 'Внешний сайт ВК, запущенный на десктопном браузере',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [VK_PLATFORM_CLASSNAME.desktop],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: false,
      isWeb: true,
      isMessenger: false,
    },
  },
  mvk_external_desktop: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на десктопе (m.vk.com)',
    userAgent: NO_MATTER_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: false,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mvk_external_android: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на андроиде',
    userAgent: MOCK_ANDROID_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.android,
    ],
    deviceInfoToExpect: {
      isAndroid: true,
      isIos: false,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mvk_external_iphone: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPhone',
    userAgent: MOCK_IPHONE_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mvk_external_ipad: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPad',
    userAgent: MOCK_IPAD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
  },
  mvk_external_ipod: {
    vkPlatform: 'mvk_external',
    name: 'Cайт, открытый в мобильном браузере на iPod',
    userAgent: MOCK_IPOD_USERAGENT,
    bodyClassesToExpect: [
      VK_PLATFORM_CLASSNAME.mobile,
      VK_PLATFORM_CLASSNAME.web,
      VK_PLATFORM_CLASSNAME.ios,
    ],
    deviceInfoToExpect: {
      isAndroid: false,
      isIos: true,
      isMobile: true,
      isWeb: true,
      isMessenger: false,
    },
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
    ({
      vkPlatform,
      name,
      bodyClassesToExpect,
      userAgent,
      deviceInfoToExpect,
    }) => {
      it(name, () => {
        userAgentGetter.mockReturnValue(userAgent);

        const result = checkVkPlatform(vkPlatform);

        const bodyClasses = [...document.body.classList];

        expect(bodyClasses).toEqual(
          expect.arrayContaining(bodyClassesToExpect)
        );

        expect(bodyClasses).not.toEqual(
          expect.arrayContaining(
            getExcludedVkPlatformClasses(bodyClassesToExpect)
          )
        );

        expect(result).toEqual(deviceInfoToExpect);
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
