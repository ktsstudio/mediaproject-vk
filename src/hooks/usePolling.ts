import * as React from 'react';
import bridge, {
  AnyReceiveMethodName,
  VKBridgeEvent,
} from '@vkontakte/vk-bridge';

/**
 * Вызывает переданную функцию с указанной частотой, останавливая поллинг при сворачивании приложения.
 * @param callback Функция, которую нужно вызывать
 * @param condition Условие, при котором нужно вызывать функцию. По умолчанию она вызывается всегда
 * @param pollingInterval Промежуток времени между вызовами в миллисекундах. По умолчанию минута
 */
const usePolling = (
  callback: VoidFunction,
  condition = true,
  pollingInterval = 60000
): void => {
  const timer = React.useRef<NodeJS.Timeout | null>(null);

  const stopPolling = React.useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const startPolling = React.useCallback(() => {
    stopPolling();
    callback();

    timer.current = setInterval(callback, pollingInterval);
  }, []);

  React.useEffect(() => {
    if (condition) {
      startPolling();
    }

    return () => stopPolling();
  }, [condition]);

  const hideAppListener = React.useCallback(
    (event: VKBridgeEvent<AnyReceiveMethodName>) => {
      const eventType = event.detail.type;

      if (eventType === 'VKWebAppViewHide') {
        stopPolling();
      }

      if (eventType === 'VKWebAppViewRestore') {
        if (condition && !timer.current) {
          startPolling();
        }
      }
    },
    [condition]
  );

  React.useEffect(() => {
    bridge.subscribe(hideAppListener);

    return () => bridge.unsubscribe(hideAppListener);
  }, [condition]);
};

export { usePolling };
