import originalBridge from '@vkontakte/vk-bridge';
import { renderHook } from '@testing-library/react';

import { useEventSubscribe } from '../hooks';

jest.mock('@vkontakte/vk-bridge');

const bridge = originalBridge as jest.Mocked<typeof originalBridge>;

const MOCK_BRIDGE_EVENT = 'VKWebAppInit';

describe('Хук useEventSubscribe', () => {
  const mockCallback = jest.fn();

  afterEach(() => {
    bridge.subscribe.mockClear();
    bridge.unsubscribe.mockClear();
    mockCallback.mockClear();
  });

  beforeEach(() => {
    // Гарантированно замокать имплементацию
    bridge.subscribe.mockImplementation(() => undefined);
    bridge.unsubscribe.mockImplementation(() => undefined);
  });

  it('Происходит подписка и отписка при монтировании и размонтировании соответственно', () => {
    const { unmount } = renderHook(() =>
      useEventSubscribe(MOCK_BRIDGE_EVENT, mockCallback)
    );

    expect(bridge.subscribe).toBeCalledTimes(1);

    // eslint-disable-next-line prefer-destructuring
    const listener = bridge.subscribe.mock.calls[0][0];

    unmount();

    expect(bridge.unsubscribe).toBeCalledTimes(1);
    expect(bridge.unsubscribe).toBeCalledWith(listener);
  });

  it('Происходит подписка и отписка при изменении аргумента с зависимостями', () => {
    const { rerender } = renderHook(
      ({ deps }) => useEventSubscribe(MOCK_BRIDGE_EVENT, mockCallback, deps),
      { initialProps: { deps: [1, 2, 3] } }
    );

    expect(bridge.subscribe).toBeCalledTimes(1);

    // eslint-disable-next-line prefer-destructuring
    const firstListener = bridge.subscribe.mock.calls[0][0];

    rerender({ deps: [1, 2, 4] });

    expect(bridge.unsubscribe).toBeCalledTimes(1);
    expect(bridge.unsubscribe).toHaveBeenLastCalledWith(firstListener);

    expect(bridge.subscribe).toBeCalledTimes(2);
    expect(bridge.subscribe).not.toHaveBeenLastCalledWith(firstListener);

    // eslint-disable-next-line prefer-destructuring
    const secondListener = bridge.subscribe.mock.calls[1][0];

    rerender({ deps: [1, 2, 5] });

    expect(bridge.unsubscribe).toBeCalledTimes(2);
    expect(bridge.unsubscribe).toBeCalledWith(secondListener);

    expect(bridge.subscribe).toBeCalledTimes(3);
    expect(bridge.subscribe).not.toHaveBeenLastCalledWith(secondListener);
  });
});
