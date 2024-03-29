import { useRef, useCallback, useEffect } from 'react';
import bridge, {
  AnyReceiveMethodName,
  VKBridgeEvent,
} from '@vkontakte/vk-bridge';

/**
 * Хук для вызова переданной функции с указанной частотой.
 * При сворачивании приложения вызов функции останавливается.
 *
 * @param {VoidFunction} callback Функция, которую нужно вызывать.
 * @param {boolean} [condition=true] Условие, при котором нужно вызывать функцию. По умолчанию она вызывается всегда.
 * @param {number} [pollingInterval=60000] Промежуток времени между вызовами в миллисекундах. По умолчанию минута.
 */
const usePolling = (
  callback: VoidFunction,
  condition = true,
  pollingInterval = 60000
): void => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    callback();

    timer.current = setInterval(callback, pollingInterval);
  }, []);

  useEffect(() => {
    if (condition) {
      startPolling();
    }

    return () => stopPolling();
  }, [condition]);

  const hideAppListener = useCallback(
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

  useEffect(() => {
    bridge.subscribe(hideAppListener);

    return () => bridge.unsubscribe(hideAppListener);
  }, [condition]);
};

export { usePolling };
