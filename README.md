![kts](./logo.png)

# @ktsstudio/mediaproject-vk

Пакет с утилитами для VK Mini Apps.

## Использование

`npm install @ktsstudio/mediaproject-vk`

`yarn add @ktsstudio/mediaproject-vk`

## О пакете

Пакет содержит тайные знания, накопленные разработчиками [KTS](https://kts.studio/) за время работы над VK Mini Apps. Список утилит приведен ниже.

## Обратная связь

Любой фидбэк вы можете отправить нам на почту [hello@ktsstudio.ru](mailto:hello@ktsstudio.ru)

## Содержимое

### Утилиты-обертки над [VK Bridge](https://github.com/VKCOM/vk-bridge)

- [callVkApi](./src/callVkApi.ts)
- [getVkAccessToken](./src/getVkAccessToken.ts)
- [setVkViewSettings](./src/setVkViewSettings.ts)
- [shareVkPost и shareVkPostWithUpload](./src/shareVkPost.ts)
- [shareVkStory](./src/shareVkStory.ts)

### Хуки

- [useEventSubscribe](./src/hooks/useEventSubscribe.ts)
- [usePolling](./src/hooks/usePolling.ts)

### Дополнительные утилиты

- [checkVkAvatarIsDefault](./src/checkVkAvatarIsDefault.ts)
- [checkVkPlatform](./src/checkVkPlatform.ts)
- [initializeVkApp](./src/initializeVkApp.ts)
