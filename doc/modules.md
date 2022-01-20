[mediaproject-vk - v1.2.1](README.md) / Exports

# mediaproject-vk - v1.2.1

index

## Table of contents

### Enumerations

- [BackgroundStoryEnum](enums/BackgroundStoryEnum.md)
- [PostAttachmentMediaEnum](enums/PostAttachmentMediaEnum.md)
- [VibrationImpactEnum](enums/VibrationImpactEnum.md)
- [VibrationNotificationEnum](enums/VibrationNotificationEnum.md)

### Interfaces

- [WindowType](interfaces/WindowType.md)

### Type aliases

- [PostAttachmentType](modules.md#postattachmenttype)
- [StoryAttachmentType](modules.md#storyattachmenttype)
- [ViewSettingsType](modules.md#viewsettingstype)

### Properties

- [addToFavorites](modules.md#addtofavorites)
- [allowMessagesFromGroup](modules.md#allowmessagesfromgroup)
- [allowNotifications](modules.md#allownotifications)
- [checkIOS](modules.md#checkios)
- [getAuthToken](modules.md#getauthtoken)
- [getUserInfo](modules.md#getuserinfo)
- [initializeVkApp](modules.md#initializevkapp)
- [isAvatarDefault](modules.md#isavatardefault)
- [setSwipeSettings](modules.md#setswipesettings)
- [setViewSettings](modules.md#setviewsettings)
- [shareLink](modules.md#sharelink)
- [sharePost](modules.md#sharepost)
- [shareStory](modules.md#sharestory)
- [useEventSubscribe](modules.md#useeventsubscribe)
- [usePolling](modules.md#usepolling)
- [vkApi](modules.md#vkapi)

### Functions

- [checkMobile](modules.md#checkmobile)
- [vibrateAsImpact](modules.md#vibrateasimpact)
- [vibrateAsNotification](modules.md#vibrateasnotification)
- [vibrateAsSelection](modules.md#vibrateasselection)

## Type aliases

### PostAttachmentType

Ƭ **PostAttachmentType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `media_id` | `number` \| `string` |
| `owner_id` | `number` \| `string` |
| `type` | [`PostAttachmentMediaEnum`](enums/PostAttachmentMediaEnum.md) |

#### Defined in

[src/types/sharing.ts:15](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/types/sharing.ts#L15)

___

### StoryAttachmentType

Ƭ **StoryAttachmentType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `access_key?` | `string` |
| `id?` | `number` |
| `owner_id?` | `number` |
| `text` | `string` |
| `type` | ``"url"`` \| ``"audio"`` \| ``"video"`` \| ``"photo"`` |
| `url?` | `string` |

#### Defined in

[src/types/sharing.ts:27](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/types/sharing.ts#L27)

___

### ViewSettingsType

Ƭ **ViewSettingsType**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `action_bar_color?` | ``"none"`` \| `string` | Android only |
| `navigation_bar_color?` | `string` | Android only |
| `status_bar_style` | `AppearanceType` | - |

#### Defined in

[src/types/viewSettings.ts:3](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/types/viewSettings.ts#L3)

## Properties

### addToFavorites

• **addToFavorites**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Обертка для метода VKWebAppAddToFavorites. Добавляет приложение в список избранных

##### Returns

`Promise`<`boolean`\>

true, если приложение было добавлено

___

### allowMessagesFromGroup

• **allowMessagesFromGroup**: (`group_id`: `number`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`group_id?`): `Promise`<`boolean`\>

Обертка для метода VKWebAppAllowMessagesFromGroup. Запрашивает у юзера разрешение на получение сообщений от сообщества

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group_id` | `number` | ID группы VK. По умолчанию читается из window.group_id |

##### Returns

`Promise`<`boolean`\>

true, если разрешение было получено

___

### allowNotifications

• **allowNotifications**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Обертка для VKWebAppAllowNotifications. Запрашивает у юзера разрешение на отправку уведомлений от приложения

##### Returns

`Promise`<`boolean`\>

true, если разрешение было получено

___

### checkIOS

• **checkIOS**: (`platform`: `string`) => `boolean`

#### Type declaration

▸ (`platform?`): `boolean`

Метод для проверки, является ли текущая платформа IOS.
Проверяет параметр platform, полученный при инициализации приложения.
В случае совпадения устанавливает window.is_ios = true.
Добавляет класс 'ios' или 'android' на document.body.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `platform` | `string` | `window.platform` | Полученная от VK текущая платформа. По умолчанию берется из Window.platform. |

##### Returns

`boolean`

Возвращает true, если платформа IOS

___

### getAuthToken

• **getAuthToken**: (`app_id`: `number`, `accessScope`: `PersonalAuthScope` \| `PersonalAuthScope`[]) => `Promise`<`string` \| `boolean`\>

#### Type declaration

▸ (`app_id`, `accessScope`): `Promise`<`string` \| `boolean`\>

Получает access token с переданными параметрами access scope.
В случае успеха возвращает строку с токеном.
В случае ошибки возвращает false,
Возвращает true, если пользователь не дал разрешение (ошибка 'User denied') либо дал разрешение не на все скоупы

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app_id` | `number` | ID VK-приложения, которое запрашивает доступ |
| `accessScope` | `PersonalAuthScope` \| `PersonalAuthScope`[] | параметры доступа access scope. То, к чему в результате будет доступ с запрашиваемым токеном (друзья, фото и т.д.) |

##### Returns

`Promise`<`string` \| `boolean`\>

___

### getUserInfo

• **getUserInfo**: () => `Promise`<``null`` \| `UserInfo`\>

#### Type declaration

▸ (): `Promise`<``null`` \| `UserInfo`\>

##### Returns

`Promise`<``null`` \| `UserInfo`\>

___

### initializeVkApp

• **initializeVkApp**: () => `void`

#### Type declaration

▸ (): `void`

Утилита для инициализации параметров vk-mini-app. Берет параметры из строки с квери-параметрами.
Сначала инициализирует общие параметры через initializeAppParams из @ktsstudio/mediaproject-utils.
Параметры, которые устанавливаются: search, location_hash, is_production, is_dev,
app_id, scope, user_id, group_id, platform, is_mobile, page, is_odr, is_ios.
Добавляет классы на document.body:
- 'mobile' или 'desktop' в зависимости от устройства;
- 'ios' или 'android' в зависимости от платформы.
Отправляет событие VKWebAppInit в vk-bridge.

##### Returns

`void`

___

### isAvatarDefault

• **isAvatarDefault**: (`photo`: `string`, `size`: ``50`` \| ``100`` \| ``200`` \| ``400``) => `boolean`

#### Type declaration

▸ (`photo`, `size?`): `boolean`

Проверяет, является ли фотография пользователя дефолтной аватаркой.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `photo` | `string` | `undefined` | Фотография |
| `size` | ``50`` \| ``100`` \| ``200`` \| ``400`` | `100` | Размер фотографии. Например, для поля photo_100 размер равен 100. По умолчанию равен 100 |

##### Returns

`boolean`

Результат проверки

___

### setSwipeSettings

• **setSwipeSettings**: (`history`: `boolean`) => `void`

#### Type declaration

▸ (`history?`): `void`

Обертка для VKWebAppSetSwipeSettings

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `history` | `boolean` | `true` |

##### Returns

`void`

___

### setViewSettings

• **setViewSettings**: (`viewSettings`: [`ViewSettingsType`](modules.md#viewsettingstype)) => `void`

#### Type declaration

▸ (`viewSettings?`): `void`

Обертка для VKWebAppSetViewSettings.
Устанавливает цвета statusbar и actionbar (IOS и Android), navigationbar (Android).
По умолчанию устанавливает темный цвет содержимого статус-бара (status_bar_style: 'dark') и белый фон (action_bar_color: 'white'),
а также белый цвет навигационного меню (navigation_bar_color: 'white').

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `viewSettings` | [`ViewSettingsType`](modules.md#viewsettingstype) | `defaultViewSettings` | Цветовые настройки statusbar, actionbar, navigationbar |

##### Returns

`void`

___

### shareLink

• **shareLink**: (`link`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`link`): `Promise`<`boolean`\>

Обертка для VKWebAppShare.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `link` | `string` | Ссылка, которую нужно пошерить |

##### Returns

`Promise`<`boolean`\>

___

### sharePost

• **sharePost**: (`message`: `string`, `mediaAttachments`: [`PostAttachmentType`](modules.md#postattachmenttype)[], `linksAttachments`: `string`[], `extra`: `Partial`<`WallPostRequestOptions`\>) => `Promise`<``null`` \| `boolean`\>

#### Type declaration

▸ (`message`, `mediaAttachments?`, `linksAttachments?`, `extra?`): `Promise`<``null`` \| `boolean`\>

Метод для шеринга поста на стену.
В случае успеха возвращает true
В случае ошибки возвращает false,
Возвращает null, если пользователь не дал разрешение (ошибка 'User denied')

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | Текст поста |
| `mediaAttachments` | [`PostAttachmentType`](modules.md#postattachmenttype)[] | `[]` | Медиа аттачи к посту (фотки, видосы и т.д., но не ссылки) |
| `linksAttachments` | `string`[] | `[]` | Аттачи-ссылки |
| `extra` | `Partial`<`WallPostRequestOptions`\> | `{}` | Дополнительные параметры для шеринга поста |

##### Returns

`Promise`<``null`` \| `boolean`\>

___

### shareStory

• **shareStory**: (`url?`: `string`, `blob?`: `string`, `attachment?`: [`StoryAttachmentType`](modules.md#storyattachmenttype), `locked`: `boolean`, `background_type`: [`BackgroundStoryEnum`](enums/BackgroundStoryEnum.md)) => `Promise`<``null`` \| `boolean`\>

#### Type declaration

▸ (`url?`, `blob?`, `attachment?`, `locked?`, `background_type?`): `Promise`<``null`` \| `boolean`\>

Метод для шеринга истории.
В случае успеха возвращает true
В случае ошибки возвращает false,
Возвращает null, если пользователь не дал разрешение (ошибка 'User denied')

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url?` | `string` | `undefined` | Url картинки, которая шерится в историю |
| `blob?` | `string` | `undefined` | Картинка для шеринга в base64 |
| `attachment?` | [`StoryAttachmentType`](modules.md#storyattachmenttype) | `undefined` | Аттач к истории - ссылка с кнопкой и т.д. |
| `locked` | `boolean` | `true` | Можно ли изменять размер и положение фоновой картинки |
| `background_type` | [`BackgroundStoryEnum`](enums/BackgroundStoryEnum.md) | `BackgroundStoryEnum.image` | Тип фона - картинка, видео или фона нет |

##### Returns

`Promise`<``null`` \| `boolean`\>

___

### useEventSubscribe

• **useEventSubscribe**: (`eventName`: keyof `ReceiveDataMap`, `callBack`: `VoidFunction`, `deps`: `any`) => `void`

#### Type declaration

▸ (`eventName`, `callBack`, `deps?`): `void`

Подписывается на событие vk-bridge.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `eventName` | keyof `ReceiveDataMap` | `undefined` | Название события |
| `callBack` | `VoidFunction` | `undefined` | Колбэк, вызываемый при наступлении события |
| `deps` | `any` | `[]` | Зависимости переданного колбэка. По умолчанию пустые |

##### Returns

`void`

___

### usePolling

• **usePolling**: (`callback`: `VoidFunction`, `condition`: `boolean`, `pollingInterval`: `number`) => `void`

#### Type declaration

▸ (`callback`, `condition?`, `pollingInterval?`): `void`

Вызывает переданную функцию с указанной частотой, останавливая поллинг при сворачивании приложения.

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `callback` | `VoidFunction` | `undefined` | Функция, которую нужно вызывать |
| `condition` | `boolean` | `true` | Условие, при котором нужно вызывать функцию. По умолчанию она вызывается всегда |
| `pollingInterval` | `number` | `60000` | Промежуток времени между вызовами в миллисекундах. По умолчанию минута |

##### Returns

`void`

___

### vkApi

• **vkApi**: (`method`: `string`, `access_token`: `string`, `params`: {}) => `Promise`<{ `response`: `any`  } \| { `error`: `any`  }\>

#### Type declaration

▸ (`method`, `access_token`, `params?`): `Promise`<{ `response`: `any`  } \| { `error`: `any`  }\>

Обертка для VKWebAppCallAPIMethod.
Вызывает метод vk api версии 5.131.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | метод vk api |
| `access_token` | `string` | vk access token |
| `params` | `Object` | дополнительные параметры |

##### Returns

`Promise`<{ `response`: `any`  } \| { `error`: `any`  }\>

## Functions

### checkMobile

▸ **checkMobile**(`platform?`): `boolean`

Проверяет является ли мобильной платформа, на которой открыто vk-приложение.
Устанавливает window.is_mobile = true, если является.
Добавляет класс 'mobile' или 'desktop' на document.body в зависимости от результата проверки.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `platform` | `string` | `window.platform` | Текущая платформа, получаемая при инициализации vk-приложения. По умолчанию window.platform. |

#### Returns

`boolean`

Результат проверки.

#### Defined in

[src/checkMobile.ts:8](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/checkMobile.ts#L8)

___

### vibrateAsImpact

▸ `Const` **vibrateAsImpact**(`style`): `void`

Обертка для VKWebAppTapticImpactOccurred. Имитация виброотклика на ошибку.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `style` | [`VibrationImpactEnum`](enums/VibrationImpactEnum.md) | Одна из трех степеней силы вибрации |

#### Returns

`void`

#### Defined in

[src/vibrate.ts:12](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/vibrate.ts#L12)

___

### vibrateAsNotification

▸ `Const` **vibrateAsNotification**(`type`): `void`

Обертка для VKWebAppTapticNotificationOccurred. Имитация виброотклика на какое-либо действие.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`VibrationNotificationEnum`](enums/VibrationNotificationEnum.md) | Тип вибрации в зависимости от действия - ошибка, ворнинг или успех |

#### Returns

`void`

#### Defined in

[src/vibrate.ts:22](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/vibrate.ts#L22)

___

### vibrateAsSelection

▸ `Const` **vibrateAsSelection**(): `void`

Обертка для VKWebAppTapticSelectionChanged. Имитация виброотклика выбора

#### Returns

`void`

#### Defined in

[src/vibrate.ts:33](https://github.com/ktsstudio/mediaproject-vk/blob/1c5e391/src/vibrate.ts#L33)
