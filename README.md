![kts](./logo.png)

# @ktsstudio/mediaproject-vk

Пакет с утилитами для медиапроектов vk-mini-app.

### Использование

`npm install @ktsstudio/mediaproject-vk`

`yarn add @ktsstudio/mediaproject-vk`

### О пакете

Содержит обертки для некоторых методов vk-bridge.
Также содержит [метод-обертку для работы VK API через vk-bridge](./src/callApi.ts) и [утилиту для инициализации параметров vk-приложения](./src/initializeApp.ts)
с использованием GET-параметров. Хранит параметры приложения в [Window](./src/types/window.ts).

#### Методы-обертки для vk-bridge:

- [callApi](./src/callApi.ts) - вызов метода API VK (VKWebAppCallAPIMethod)
- [getAccessToken](./src/getAccessToken.ts) - получение access token пользователя (VKWebAppGetAuthToken)
- [setViewSettings](./src/setViewSettings.ts) - установить настройки status bar и других ui-элементов на мобильных платформах (VKWebAppShowWallPostBox)
- [sharePost](./src/sharePost.ts) - поделиться постом на стену (VKWebAppShowWallPostBox)
- [shareStory](./src/shareStory.ts) - поделиться историей (VKWebAppShowStoryBox)

#### Другие методы:

- [checkMobile, checkIOS](./src/checkPlatform.ts) - методы ждя распознавания платформы, на которой открыто приложение (на основе параметра запуска vk_platform)
- [initializeApp](./src/initializeApp.ts) - утилита для парсинга и сохранения параметров запуска vk-mini-app

#### Хуки:

- [useEventSubscribe](./src/hooks/useEventSubscribe.ts) - хук для подписки на событие vk-bridge
- [usePolling](./src/hooks/usePolling.ts) - хук для поллинга внутри мини-приложения ВК

### Обратная связь

Любой фидбэк вы можете передать нам на почту [hello@ktsstudio.ru](mailto:hello@ktsstudio.ru) в письме с темой "mediaproject-vk feedback"
