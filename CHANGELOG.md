### v1.2.1
- [*] @ktsstudio/mediaprojetc-utils@4.0.0

### v1.2.0
- [+] useEventSubscribe
- [+] usePolling
- [*] initializeVkApp добавляет класс 'desktop'
- [*] getAuthToken проверяет наличие всех скоупов в ответе
- [+] isAvatarDefault

#### v1.1.0
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

#### v1.0.0
[+] Обертки для методов: 
  * VKWebAppAddToFavorites - добавление в избранное
  * VKWebAppAllowMessagesFromGroup - запрос на разрешение отправки сообщений от группы
  * VKWebAppAllowNotifications - запрос на разрешение получения уведомлений от приложения
  * VKWebAppGetAuthToken - получение токена пользователя
  * VKWebAppGetUserInfo - получение данных пользователя
  * VKWebAppSetSwipeSettings - включение swipe back
  * VKWebAppSetViewSettings - кастомизация статус-бара и других элементов
  * VKWebAppShare - шеринг ссылки
  * VKWebAppShowWallPostBox - шеринг поста
  * VKWebAppShowStoryBox - шеринг истории
  * VKWebAppTapticImpactOccurred - вибрация на ошибку
  * VKWebAppTapticNotificationOccurred - вибрация на уведомление
  * VKWebAppTapticSelectionChanged - вибрация на выбор
  * VKWebAppCallAPIMethod - вызов метода API
