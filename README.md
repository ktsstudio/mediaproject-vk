![kts](./logo.png)

# @ktsstudio/mediaproject-vk

Пакет с утилитами для медиапроектов vk-mini-app.

### Использование

`npm install @ktsstudio/mediaproject-vk`

`yarn add @ktsstudio/mediaproject-vk`

### О пакете

Содержит обертки для некоторых методов vk-bridge.
Также содержит [метод-обертку для работы VK API через vk-bridge](./src/callVkApi.ts) и [утилиту для инициализации параметров vk-приложения](./src/initializeVkApp.ts)
с использованием GET-параметров. Хранит параметры приложения в [Window](./src/types/window.ts).

#### Методы-обертки для vk-bridge:

- [callVkApi](./src/callVkApi.ts) - вызов метода API VK (VKWebAppCallAPIMethod)
- [getVkAccessToken](./src/getVkAccessToken.ts) - получение access token пользователя (VKWebAppGetAuthToken)
- [setVkViewSettings](./src/setVkViewSettings.ts) - установить настройки status bar и других ui-элементов на мобильных платформах (VKWebAppShowWallPostBox)
- [shareVkPost](./src/shareVkPost.ts) - поделиться постом на стену (VKWebAppShowWallPostBox)
- [shareVkStory](./src/shareVkStory.ts) - поделиться историей (VKWebAppShowStoryBox)

#### Другие методы:

- [checkMobile, checkIOS](./src/checkVkPlatform.ts) - методы для распознавания платформы, на которой открыто приложение (на основе параметра запуска vk_platform)
- [initializeVkApp](./src/initializeVkApp.ts) - утилита для парсинга и сохранения параметров запуска vk-mini-app

#### Хуки:

- [useEventSubscribe](./src/hooks/useEventSubscribe.ts) - хук для подписки на событие vk-bridge
- [usePolling](./src/hooks/usePolling.ts) - хук для поллинга внутри мини-приложения ВК

### Обратная связь

Любой фидбэк вы можете передать нам на почту [hello@ktsstudio.ru](mailto:hello@ktsstudio.ru) в письме с темой "mediaproject-vk feedback"
