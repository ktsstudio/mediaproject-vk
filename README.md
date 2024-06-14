![kts](./logo.png)

# @ktsstudio/mediaproject-vk

Пакет с утилитами для [VK Mini Apps](https://dev.vk.com/mini-apps/overview).

## Установка

`npm install @ktsstudio/mediaproject-vk`

`yarn add @ktsstudio/mediaproject-vk`

## О пакете

Пакет содержит тайные знания, накопленные разработчиками [KTS](https://kts.studio/) за время работы над VK Mini Apps.
Список основных утилит приведен ниже.

## Содержимое

### Утилиты-обертки над [VK Bridge](https://github.com/VKCOM/vk-bridge)

- [callVkApi](./src/callVkApi.ts)
- [getVkAccessToken](./src/getVkAccessToken.ts)
- [setVkViewSettings](./src/setVkViewSettings.ts)
- [shareVkPost и shareVkPostWithUpload](./src/shareVkPost.ts)
- [shareVkStory](./src/shareVkStory.ts)
- [getVkStatuses](./src/getVkStatuses.ts)
- [getVkStatus](./src/getVkStatus.ts)
- [setVkStatus](./src/setVkStatus.ts)

### Хуки

- [useEventSubscribe](./src/hooks/useEventSubscribe.ts)
- [usePolling](./src/hooks/usePolling.ts)

### Дополнительные утилиты

- [checkVkAvatarIsDefault](./src/checkVkAvatarIsDefault.ts)
- [checkVkPlatform](./src/checkVkPlatform.ts)
- [isVkError](./src/isVkError.ts)

## Покрытие тестами

Все утилиты покрыты автотестами. Исключениями являются утилиты [initializeVkApp](./src/initializeVkApp.ts)
(вскоре будет удалена в соответствии с обновлениями об [отказе от использования window для записи параметров приложения](https://github.com/ktsstudio/mediaproject-vk/pull/18))
и [shareVkPost](./src/shareVkPost.ts) (будет покрыта автотестами после внедрения [mediaproject-utils версии 5](https://github.com/ktsstudio/mediaproject-utils/pull/18)

Для запуска автотестов воспользуйтесь следующей командой:

`yarn test`

Для запуска тестов и сбора статистики по покрытию автотестами проекта, запустите команду:

`yarn test:cover`

Ниже представлена команда для запуска тестов и сбора списка названий всех выполненных тест-кейсов в файл по пути `./src/__test__/testsList.txt`.
Команда предназначена для удобства обзора всех тест-кейсов. Запускайте её, если меняете названия тест-кейсов,
их структуру или количество:

`yarn test:list`

## Обратная связь

Любой фидбэк вы можете отправить нам на почту [hello@ktsstudio.ru](mailto:hello@ktsstudio.ru) или в личные сообщения [нашего сообщества ВКонтакте](https://vk.com/kts.specials).
