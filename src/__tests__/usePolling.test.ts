import { renderHook } from '@testing-library/react';
import originalBridge from '@vkontakte/vk-bridge';

import { usePolling } from '../hooks';

jest.mock('@vkontakte/vk-bridge');

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

const DEFAULT_POLLING_INTERVAL_S = 60;
const DEFAULT_POLLING_INTERVAL_MS = 1000 * DEFAULT_POLLING_INTERVAL_S;

type UsePollingProps = {
  condition?: boolean;
  pollingInterval?: number;
};

jest.useFakeTimers();

beforeEach(() => {
  jest.useFakeTimers();

  // Гарантированно замокать имплементацию
  bridge.subscribe.mockImplementation(() => undefined);
  bridge.unsubscribe.mockImplementation(() => undefined);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();

  bridge.subscribe.mockClear();
  bridge.unsubscribe.mockClear();
});

describe('Хук usePolling:', () => {
  describe('С параметрами по умолчанию:', () => {
    test('должен устанавливать и очищать таймер', () => {
      jest.spyOn(global, 'setInterval');
      jest.spyOn(global, 'clearInterval');

      const callback = jest.fn();

      const { rerender, unmount } = renderHook(() => usePolling(callback));

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(
        callback,
        DEFAULT_POLLING_INTERVAL_MS
      );
      expect(clearInterval).not.toBeCalled();

      rerender();

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).not.toBeCalled();

      unmount();

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
    });

    test(`должен вызывать переданную функцию с частотой - ${DEFAULT_POLLING_INTERVAL_S} секунд`, () => {
      const callback = jest.fn();

      renderHook(() => usePolling(callback));

      expect(callback).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS - 1);
      expect(callback).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS - 1);
      expect(callback).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS * 100_000);
      expect(callback).toHaveBeenCalledTimes(3 + 100_000);
    });
  });

  describe('С параметром (condition = false):', () => {
    test('не должен устанавливать и очищать таймер', () => {
      jest.spyOn(global, 'setInterval');
      jest.spyOn(global, 'clearInterval');

      const callback = jest.fn();

      const { rerender, unmount } = renderHook(() =>
        usePolling(callback, false)
      );

      expect(setInterval).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();

      rerender();

      expect(setInterval).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();

      unmount();

      expect(setInterval).not.toBeCalled();
      expect(clearInterval).not.toBeCalled();
    });

    test('не должен вызывать переданную функцию', () => {
      const callback = jest.fn();

      renderHook(() => usePolling(callback, false));

      expect(callback).not.toBeCalled();

      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS * 100_000);
      expect(callback).not.toBeCalled();
    });
  });

  describe('С переключением параметра condition в жизненном цикле хука:', () => {
    test('должен устанавливать и очищать таймер при каждом переключении', () => {
      jest.spyOn(global, 'setInterval');
      jest.spyOn(global, 'clearInterval');

      const callback = jest.fn();

      const { rerender, unmount } = renderHook<void, UsePollingProps>((props) =>
        usePolling(callback, props?.condition)
      );

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).not.toBeCalled();

      rerender({ condition: false });

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledTimes(1);

      rerender({ condition: true });

      expect(setInterval).toHaveBeenCalledTimes(2);
      expect(clearInterval).toHaveBeenCalledTimes(1);

      unmount();

      expect(setInterval).toHaveBeenCalledTimes(2);
      expect(clearInterval).toHaveBeenCalledTimes(2);
    });

    test(`если (condition = true) должен вызывать переданную функцию с частотой - ${DEFAULT_POLLING_INTERVAL_S} секунд`, () => {
      const callback = jest.fn();

      const { rerender } = renderHook<void, UsePollingProps>(
        (props) => usePolling(callback, props?.condition),
        { initialProps: { condition: false } }
      );

      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS * 100_000);
      expect(callback).not.toBeCalled();

      rerender({ condition: true });
      expect(callback).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS * 100_000);
      expect(callback).toHaveBeenCalledTimes(1 + 100_000);
      callback.mockReset();

      rerender({ condition: false });
      jest.advanceTimersByTime(DEFAULT_POLLING_INTERVAL_MS * 100_000);
      expect(callback).not.toBeCalled();
    });
  });

  describe('Параметр pollingInterval должен задавать промежуток времени между вызовами в миллисекундах:', () => {
    const customInterval = 100;

    test(`должен вызывать переданную функцию с частотой - ${customInterval} миллисекунд`, () => {
      const callback = jest.fn();

      renderHook(() => usePolling(callback, undefined, customInterval));

      expect(callback).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(customInterval - 1);
      expect(callback).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(customInterval - 1);
      expect(callback).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(customInterval * 100_000);
      expect(callback).toHaveBeenCalledTimes(3 + 100_000);
    });

    test('не должен меняться при ререндерах', () => {
      const callback = jest.fn();

      const { rerender } = renderHook<void, UsePollingProps>(
        (props) => usePolling(callback, undefined, props?.pollingInterval),
        { initialProps: { pollingInterval: customInterval } }
      );

      expect(callback).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(customInterval * 100_000);
      expect(callback).toHaveBeenCalledTimes(1 + 100_000);
      callback.mockReset();

      rerender({ pollingInterval: DEFAULT_POLLING_INTERVAL_MS });

      expect(callback).not.toBeCalled();

      jest.advanceTimersByTime(customInterval * 100_000);
      expect(callback).toHaveBeenCalledTimes(100_000);
    });
  });

  describe('Должен подписываться на событие скрытия приложения и отписываться от него:', () => {
    it('при монтировании и размонтировании', () => {
      const callback = jest.fn();

      const { unmount } = renderHook(() => usePolling(callback));

      expect(bridge.subscribe).toBeCalledTimes(1);

      const listener = bridge.subscribe.mock.calls[0][0];

      unmount();

      expect(bridge.unsubscribe).toBeCalledTimes(1);
      expect(bridge.unsubscribe).toBeCalledWith(listener);
    });

    it('при смене аргумента condition', () => {
      const callback = jest.fn();

      const { rerender } = renderHook(
        ({ condition }) => usePolling(callback, condition),
        {
          initialProps: { condition: true },
        }
      );

      expect(bridge.subscribe).toBeCalledTimes(1);

      const firstListener = bridge.subscribe.mock.calls[0][0];

      rerender({ condition: false });

      expect(bridge.unsubscribe).toBeCalledTimes(1);
      expect(bridge.unsubscribe).toHaveBeenLastCalledWith(firstListener);

      expect(bridge.subscribe).toBeCalledTimes(2);
      expect(bridge.subscribe).not.toHaveBeenLastCalledWith(firstListener);

      const secondListener = bridge.subscribe.mock.calls[1][0];

      rerender({ condition: true });

      expect(bridge.unsubscribe).toBeCalledTimes(2);
      expect(bridge.unsubscribe).toBeCalledWith(secondListener);

      expect(bridge.subscribe).toBeCalledTimes(3);
      expect(bridge.subscribe).not.toHaveBeenLastCalledWith(secondListener);
    });
  });
});
