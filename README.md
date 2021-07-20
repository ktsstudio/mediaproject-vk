# vk-utils

Набор утилит для работы с ВК. 
Содержит обертки следующих методов:

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

## Как установить:

### 1. Доступ к реджистри:

* убедиться, что вы есть в [нексусе kts](http://nexus.team.ktsstudio.ru/) и у вас есть доступ к проекту ktsnpm
* `npm login --registry=https://nexus.team.ktsstudio.ru/repository/ktsnpm/`, затем после ввода своих данных появится файл `~/.npmrc` с токеном для доступа к реджистри

### 2. Разработка пакета:

* убедиться, что выполнен первый пункт
* `yarn run bootstrap` из корня монорепы устанавливает зависимости для всех пакетов
* `yarn run build` в пакете собирает его

### 3. Установка пакетов:

* убедиться, что выполнен первый пункт
* убедиться, что в проекте есть .npmrc, как в этом репозитории
* `yarn add @ktsstudio/vk-utils@1.0.0 --registry=https://nexus.team.ktsstudio.ru/repository/ktsnpm/` устанавливает пакет из реджистри

