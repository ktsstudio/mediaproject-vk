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

- [callVkApi](README.md#callvkapi)
- [getNewVkAccessToken](README.md#getnewvkaccesstoken)
- [getVkAccessToken](README.md#getvkaccesstoken)
- [setVkViewSettings](README.md#setvkviewsettings)
- [shareVkPost](README.md#sharevkpost)
- [shareVkPostWithUpload](README.md#sharevkpostwithupload)
- [shareVkStory](README.md#sharevkstory)

### Хуки

- [useEventSubscribe](README.md#useeventsubscribe)
- [usePolling](README.md#usepolling)

### Дополнительные утилиты

- [checkVkAvatarIsDefault](README.md#checkvkavatarisdefault)
- [checkVkPlatform](README.md#checkvkplatform)
- [checkVkScopesAreEqual](README.md#checkvkscopesareequal)
- [checkVkUserDenied](README.md#checkvkuserdenied)
- [initializeVkApp](README.md#initializevkapp)
- [parseVkScopes](README.md#parsevkscopes)

## Детальное описание

### callVkApi

▸ **callVkApi**(`props`): `Promise`<`Partial`<`Object`\>\>

Утилита для вызова метода API ВКонтакте.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppCallAPIMethod|VKWebAppCallAPIMethod](https://dev.vk.com/bridge/VKWebAppCallAPIMethod|VKWebAppCallAPIMethod)

#### Parameters

| Name    | Type                                                  | Description                                |
| :------ | :---------------------------------------------------- | :----------------------------------------- |
| `props` | [`CallVkApiPropsType`](README.md#callvkapipropstype) | Параметры для вызова метода API ВКонтакте. |

#### Returns

`Promise`<`Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppCallAPIMethod с переданными параметрами.

#### Defined in

[src/callVkApi.ts:37](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/callVkApi.ts#L37)

---

### checkVkAvatarIsDefault

▸ **checkVkAvatarIsDefault**(`props`): `boolean`

Утилита для проверки, является ли аватаром пользователя ВКонтакте [дефолтная картинка](https://vk.com/images/camera_400.png).

**`Function`**

#### Parameters

| Name    | Type                                                                              |
| :------ | :-------------------------------------------------------------------------------- |
| `props` | [`CheckVkAvatarIsDefaultParamsType`](README.md#checkvkavatarisdefaultparamstype) |

#### Returns

`boolean`

Если аватар является дефолтной картинкой, возвращает true. Иначе возвращает false.

#### Defined in

[src/checkVkAvatarIsDefault.ts:12](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/checkVkAvatarIsDefault.ts#L12)

---

### checkVkPlatform

▸ **checkVkPlatform**(`platform?`): `void`

Утилита для установки настроек под текущую платформу, на которой запущено приложение ВКонтакте.
В зависимости от платформы устанавливает нужный флаг в window и добавляет нужный класснейм на тег body.

Если текущая платформа desktop (одна из [DESKTOP_VK_PLATFORMS](README.md#desktop_vk_platforms)), устанавливает window.is_mobile = false и добавляет класснейм 'desktop' на тег body.

Если текущая платформа IOS (одна из [IOS_VK_PLATFORMS](README.md#ios_vk_platforms)), устанавливает window.is_ios = true и добавляет класснеймы 'mobile ios'.

Если текущая платформа Android (одна из [ANDROID_VK_PLATFORMS](README.md#android_vk_platforms)), устанавливает window.is_android = true и добавляет класснеймы 'mobile android'.

Если текущая платформа m.vk, устанавливает window.is_mvk = true и добавляет класснеймы 'mobile mvk'.

**`Function`**

**`See`**

https://dev.vk.com/mini-apps/development/launch-params#vk_platform

#### Parameters

| Name       | Type                                                         | Default value     | Description                                                           |
| :--------- | :----------------------------------------------------------- | :---------------- | :-------------------------------------------------------------------- |
| `platform` | `undefined` \| [`VkPlatformType`](README.md#vkplatformtype) | `window.platform` | Значение текущей платформы, полученное в параметрах запуска ВКонтакте |

#### Returns

`void`

#### Defined in

[src/checkVkPlatform.ts:85](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/checkVkPlatform.ts#L85)

---

### checkVkScopesAreEqual

▸ **checkVkScopesAreEqual**(`firstScope`, `secondScope`): `boolean`

Утилита для проверки равенства двух множеств scopes.

**`Function`**

#### Parameters

| Name          | Type                        | Description              |
| :------------ | :-------------------------- | :----------------------- |
| `firstScope`  | `Set`<`PersonalAuthScope`\> | Первое множество scopes. |
| `secondScope` | `Set`<`PersonalAuthScope`\> | Второе множество scopes. |

#### Returns

`boolean`

Если все значения из первого множества встречаются во втором, возвращает true. Иначе возвращает false.

#### Defined in

[src/getVkAccessToken.ts:60](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/getVkAccessToken.ts#L60)

---

### checkVkUserDenied

▸ **checkVkUserDenied**(`error`): `boolean`

Утилита для проверки, что пришедшая от API ВКонтакте ошибка,
получена в результате отказа пользователя от какого-либо необходимого действия.
Например, если при попытке шеринга поста на стену пользователь в системной модалке отказался от публикации поста.

**`Function`**

#### Parameters

| Name    | Type        | Description                          |
| :------ | :---------- | :----------------------------------- |
| `error` | `ErrorData` | Ошибка, полученная от API ВКонтакте. |

#### Returns

`boolean`

Если действительно ошибка возникла по причине отказа пользователя, возвращает true. Иначе возвращает false.

#### Defined in

[src/checkVkUserDenied.ts:12](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/checkVkUserDenied.ts#L12)

---

### getNewVkAccessToken

▸ **getNewVkAccessToken**(`props`): `Promise`<`Partial`<`Object`\>\>

Утилита для получения нового токена доступа без возможности того, что токен мог быть получен ранее.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppGetAuthToken](https://dev.vk.com/bridge/VKWebAppGetAuthToken)

#### Parameters

| Name    | Type                                                                        |
| :------ | :-------------------------------------------------------------------------- |
| `props` | [`GetNewVkAccessTokenParamsType`](README.md#getnewvkaccesstokenparamstype) |

#### Returns

`Promise`<`Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppGetAuthToken с переданными параметрами.

#### Defined in

[src/getVkAccessToken.ts:81](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/getVkAccessToken.ts#L81)

---

### getVkAccessToken

▸ **getVkAccessToken**(`props`): `Promise`<`null` \| `string`\>

Утилита для получения токена доступа.
Сохраняет новый токен в window.access_token и имеющиеся у него права доступа в window.scope.
Если ранее токен с требуемыми правами доступа (scopes) уже был получен, будет взят токен из window.access_token.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppGetAuthToken](https://dev.vk.com/bridge/VKWebAppGetAuthToken)

#### Parameters

| Name    | Type                                                                  |
| :------ | :-------------------------------------------------------------------- |
| `props` | [`GetVkAccessTokenParamsType`](README.md#getvkaccesstokenparamstype) |

#### Returns

`Promise`<`null` \| `string`\>

В случае успеха возвращает токен доступа. Иначе возвращает null.

#### Defined in

[src/getVkAccessToken.ts:120](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/getVkAccessToken.ts#L120)

---

### initializeVkApp

▸ **initializeVkApp**(): `Promise`<`Partial`<`Object`\>\>

Утилита для инициализации параметров mini-app ВКонтакте.
Сначала инициализирует общие параметры через initializeAppParams
из [@ktsstudio/mediaproject-utils](https://github.com/ktsstudio/mediaproject-utils).
Затем получает [параметры запуска](https://dev.vk.com/mini-apps/development/launch-params)
из query-параметров и сохраняет их в window ([WindowType](interfaces/WindowType.md)).
После этого вызывает утилиту [checkVkPlatform](README.md#checkvkplatform).
В конце отправляет событие [VKWebAppInit](https://dev.vk.com/bridge/VKWebAppInit) в vk-bridge.

**`Function`**

**`Async`**

#### Returns

`Promise`<`Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppInit.

#### Defined in

[src/initializeVkApp.ts:23](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/initializeVkApp.ts#L23)

---

### parseVkScopes

▸ **parseVkScopes**(`scopes?`): `PersonalAuthScope`[]

Утилита для вычленения массива scopes из строки.

**`Function`**

#### Parameters

| Name      | Type     | Description                                                                                                                          |
| :-------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `scopes?` | `string` | Строка, в которой через запятую перечислены scope. Допускаются только значения из [ALLOWED_VK_SCOPES](README.md#allowed_vk_scopes). |

#### Returns

`PersonalAuthScope`[]

Массив извлеченных scope. В случае ошибки возвращается пустой массив.

#### Defined in

[src/getVkAccessToken.ts:39](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/getVkAccessToken.ts#L39)

---

### setVkViewSettings

▸ **setVkViewSettings**(`viewSettings`): `Promise`<`undefined` \| `Partial`<`Object`\>\>

Утилита для установки темы для значков в статус-баре и цвета статус-бара.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppSetViewSettings](https://dev.vk.com/bridge/VKWebAppSetViewSettings)

#### Parameters

| Name                                 | Type             | Description                                                                       |
| :----------------------------------- | :--------------- | :-------------------------------------------------------------------------------- |
| `viewSettings`                       | `Object`         | Настройки для статус-бара, экшен-бара, навигейшн-бара.                            |
| `viewSettings.action_bar_color?`     | `string`         | Android only                                                                      |
| `viewSettings.navigation_bar_color?` | `string`         | Android only                                                                      |
| `viewSettings.status_bar_style`      | `AppearanceType` | Тема для значков статус-бара. Возможные значения: light — светлая. dark — тёмная. |

#### Returns

`Promise`<`undefined` \| `Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppSetViewSettings с переданными параметрами.

#### Defined in

[src/setVkViewSettings.ts:33](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/setVkViewSettings.ts#L33)

---

### shareVkPost

▸ **shareVkPost**(`props`): `Promise`<`void` \| `Partial`<`Object`\>\>

Утилита для шеринга поста на стену.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppShowWallPostBox](https://dev.vk.com/bridge/VKWebAppShowWallPostBox)

#### Parameters

| Name    | Type                                                      | Description                                                                                                                                                           |
| :------ | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `props` | [`ShareVkPostPropsType`](README.md#sharevkpostpropstype) | Объект параметров, передаваемый в метод VKWebAppShowWallPostBox. Так же может принимать поля link_image, link_button и link_title, необходимые для шеринга в сниппет. |

#### Returns

`Promise`<`void` \| `Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppShowWallPostBox с переданными параметрами.

#### Defined in

[src/shareVkPost.ts:25](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/shareVkPost.ts#L25)

---

### shareVkPostWithUpload

▸ **shareVkPostWithUpload**(`props`): `Promise`<`void` \| [`ShareVkPostWithUploadResponseType`](README.md#sharevkpostwithuploadresponsetype)\>

Утилита для шеринга поста на стену с загрузкой картинки в альбом стены пользователя.

1. Получает URL сервера ВКонтакте.

2. Передает полученный URL и файл картинки бэкенду KTS, который загружает картинку
   на сервер ВКонтакте и возвращает ссылку на нее, а так же данные сервера.

3. Сохраняет загруженную на сервер ВКонтакте картинку в альбом стены пользователя.

4. Вызывает окно шеринга поста, где во вложениях будет загруженная в альбом картинка.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/api/upload](https://dev.vk.com/api/upload) (см. раздел "Загрузка фотографии на стену")

#### Parameters

| Name    | Type                                                                            | Description                                                |
| :------ | :------------------------------------------------------------------------------ | :--------------------------------------------------------- |
| `props` | [`ShareVkPostWithUploadParamsType`](README.md#sharevkpostwithuploadparamstype) | Параметры для шеринга поста с загрузкой картинки в альбом. |

#### Returns

`Promise`<`void` \| [`ShareVkPostWithUploadResponseType`](README.md#sharevkpostwithuploadresponsetype)\>

Возвращает ответ, полученный на запрос VKWebAppShowWallPostBox или VKWebAppCallAPIMethod с переданными параметрами.

#### Defined in

[src/shareVkPost.ts:67](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/shareVkPost.ts#L67)

---

### shareVkStory

▸ **shareVkStory**(`props`): `Promise`<`void` \| `Partial`<`Object`\>\>

Утилита для шеринга истории.

**`Function`**

**`Async`**

**`See`**

[https://dev.vk.com/bridge/VKWebAppShowStoryBox](https://dev.vk.com/bridge/VKWebAppShowStoryBox)

#### Parameters

| Name    | Type                  | Description                                                                                                                        |
| :------ | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `props` | `ShowStoryBoxOptions` | Объект параметров, передаваемый в метод VKWebAppShowStoryBox. Если указан url, использует его. Иначе использует blob, если указан. |

#### Returns

`Promise`<`void` \| `Partial`<`Object`\>\>

Возвращает ответ, полученный на запрос VKWebAppShowStoryBox с переданными параметрами.

#### Defined in

[src/shareVkStory.ts:16](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/shareVkStory.ts#L16)

---

### useEventSubscribe

▸ **useEventSubscribe**(`eventName`, `callBack`, `deps?`): `void`

Хук для подписки на событие vk-bridge.

#### Parameters

| Name        | Type                   | Default value | Description                                                   |
| :---------- | :--------------------- | :------------ | :------------------------------------------------------------ |
| `eventName` | keyof `ReceiveDataMap` | `undefined`   | Название события.                                             |
| `callBack`  | `VoidFunction`         | `undefined`   | Коллбэк, вызываемый при наступлении события.                  |
| `deps`      | `DependencyList`       | `[]`          | Зависимости переданного коллбэка. По умолчанию пустой массив. |

#### Returns

`void`

#### Defined in

[src/hooks/useEventSubscribe.ts:13](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/hooks/useEventSubscribe.ts#L13)

---

### usePolling

▸ **usePolling**(`callback`, `condition?`, `pollingInterval?`): `void`

Хук для вызова переданной функции с указанной частотой.
При сворачивании приложения вызов функции останавливается.

#### Parameters

| Name              | Type           | Default value | Description                                                                      |
| :---------------- | :------------- | :------------ | :------------------------------------------------------------------------------- |
| `callback`        | `VoidFunction` | `undefined`   | Функция, которую нужно вызывать.                                                 |
| `condition`       | `boolean`      | `true`        | Условие, при котором нужно вызывать функцию. По умолчанию она вызывается всегда. |
| `pollingInterval` | `number`       | `60000`       | Промежуток времени между вызовами в миллисекундах. По умолчанию минута.          |

#### Returns

`void`

#### Defined in

[src/hooks/usePolling.ts:14](https://github.com/ktsstudio/mediaproject-vk/blob/c0537e4/src/hooks/usePolling.ts#L14)
