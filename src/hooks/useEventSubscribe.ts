import bridge, {
  VKBridgeEvent,
  AnyReceiveMethodName,
} from '@vkontakte/vk-bridge';
import { useCallback, useEffect, DependencyList } from 'react';

/**
 * Хук для подписки на событие vk-bridge.
 *
 * @param {AnyReceiveMethodName} eventName Название события.
 * @param {VoidFunction} callBack Коллбэк, вызываемый при наступлении события.
 * @param {React.DependencyList} [deps=[]] Зависимости переданного коллбэка. По умолчанию пустой массив.
 */
const useEventSubscribe = (
  eventName: AnyReceiveMethodName,
  callBack: VoidFunction,
  deps: DependencyList = []
): void => {
  const eventListener = useCallback(
    (event: VKBridgeEvent<AnyReceiveMethodName>) => {
      if (event.detail.type === eventName) {
        callBack();
      }
    },
    deps
  );

  useEffect(() => {
    bridge.subscribe(eventListener);

    return () => bridge.unsubscribe(eventListener);
  }, deps);
};

export { useEventSubscribe };
