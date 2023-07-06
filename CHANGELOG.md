#### v2.0.2

[-] shareVkPostWithUpload: убрана вложенность response


#### v2.0.1

[+] checkVkUserDenied: добавлена обработка нового кода ошибки от ВК в случае отказа от ручного действия

## v2.0.0

- [-] удалены утилиты, которые не несли смысловой нагрузки и являлись просто оберткой try catch над вызовом метода VK ([issue](https://github.com/ktsstudio/mediaproject-vk/issues/5))
- [*] изменен метод вызова VK API через bridge, в него добавлена проверка на ошибки токена и возможность ретрая в их случае
- [*] изменен метод получения access token
- [+] добавлен оптимальный метод получения access token с обращением к window
- [+] добавлен метод для шеринга в пост с загрузкой картинки на сервер VK
- [*] функция initializeVkApp теперь асинхронная (issue не было, но жалобы были)
- [+] добавлена возможность получения access token с пустым scope ([issue](https://github.com/ktsstudio/mediaproject-vk/issues/7))
- [*] исправлены возвращаемые типы всех функций ([issue](https://github.com/ktsstudio/mediaproject-vk/issues/6))
- [*] общие минорные улучшения, небольшой рефактор
- [+] сборка библиотеки на rollup, режим разработки, сборка модулей в двух форматах - cjs и es
- [*] улучшены JSDoc
- [*] хук useEventSubscribe передает полученный event в callback ([issue](https://github.com/ktsstudio/mediaproject-vk/issues/1))

#### v1.2.1

- [*] @ktsstudio/mediaprojetc-utils@4.0.0

### v1.2.0

- [+] useEventSubscribe
- [+] usePolling
- [*] initializeVkApp добавляет класс 'desktop'
- [*] getAuthToken проверяет наличие всех скоупов в ответе
- [+] isAvatarDefault

### v1.1.0

- [+] checkMobile
- [*] checkIOS: add platform 'mobile_ipad', adding classname 'android'
- [*] fix JSDoc syntax

#### v1.0.12

- [*] swipe back
- [*] view settings

#### v1.0.11

- [+] odr param in window

#### v1.0.10

- [*] params

#### v1.0.9

- [*] sharePost: wrapped try catch
- [*] shareStory: wrapped try catch

#### v1.0.8

- [*] getUserInfo: wrapped try catch

#### v1.0.7

- [*] getAuthToken: added exception handling, changed returned value

#### v1.0.6

- [*] initializeVkApp

#### v1.0.5

- [*] README

#### v1.0.4

- [+] types moved to src/types
- [*] Window type inherited
- [*] initializeVkApp
- [+] checkIOS
- [*] README

#### v1.0.3

- [*] Code style

#### v1.0.2

- [*] Code style

#### v1.0.1

[+] Метод для инициализации приложения с получением квери-параметров и отправки VKWebAppInit

## v1.0.0

[+] Обертки для методов:

- VKWebAppAddToFavorites - добавление в избранное
- VKWebAppAllowMessagesFromGroup - запрос на разрешение отправки сообщений от группы
- VKWebAppAllowNotifications - запрос на разрешение получения уведомлений от приложения
- VKWebAppGetAuthToken - получение токена пользователя
- VKWebAppGetUserInfo - получение данных пользователя
- VKWebAppSetSwipeSettings - включение swipe back
- VKWebAppSetViewSettings - кастомизация статус-бара и других элементов
- VKWebAppShare - шеринг ссылки
- VKWebAppShowWallPostBox - шеринг поста
- VKWebAppShowStoryBox - шеринг истории
- VKWebAppTapticImpactOccurred - вибрация на ошибку
- VKWebAppTapticNotificationOccurred - вибрация на уведомление
- VKWebAppTapticSelectionChanged - вибрация на выбор
- VKWebAppCallAPIMethod - вызов метода API
