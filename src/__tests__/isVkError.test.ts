import { isVkError } from '../isVkError';
import { vkErrorTypes } from '../consts';

import { randomNumberUpTo, randomString, range } from './utils';

const getRandomNumbers = () => range(3).map(() => randomNumberUpTo(10000));

const getRandomBigInts = () =>
  range(3).map(() => BigInt(randomNumberUpTo(10000)));

const getRandomStrings = () => range(3).map(() => randomString(24));

const getPrimitives = () => [
  null,
  undefined,
  false,
  true,
  Symbol(),
  Symbol('named symbol'),
  ...getRandomNumbers(),
  ...getRandomBigInts(),
  ...getRandomStrings(),
];

describe('Функция isVkError', () => {
  getPrimitives().forEach((value) =>
    it(`Примитив ${String(value)}`, () => {
      expect(isVkError(value)).toBe(false);
    })
  );

  it('Функция стрелочная', () => {
    expect(isVkError((n: number) => 'smth' + n)).toBe(false);
  });

  it('Функция не стрелочная', () => {
    expect(
      // eslint-disable-next-line prefer-arrow-callback
      isVkError(function (n: number) {
        return 'smth' + n;
      })
    ).toBe(false);
  });

  it('Пустой объект', () => {
    expect(isVkError({})).toBe(false);
  });

  it('Объект произвольной структуры', () => {
    expect(
      isVkError({
        a: 1,
        [123]: '123',
        [Symbol('b')]: null,
      })
    ).toBe(false);
  });

  it('Объект ошибки Error', () => {
    expect(isVkError(new Error())).toBe(false);
  });

  vkErrorTypes.forEach((errorType) => {
    it(`Объект с error_type, равным "${errorType}", но с отсутствующим error_data`, () => {
      expect(isVkError({ error_type: errorType })).toBe(false);
    });
  });

  vkErrorTypes.forEach((errorType) => {
    it(
      `Объект с error_type, равным "${errorType}", ` +
        'с произвольным request_id, но с отсутствующим error_data',
      () => {
        expect(
          isVkError({
            error_type: errorType,
            request_id: randomString(6),
          })
        ).toBe(false);
      }
    );
  });

  it('Объект с произвольным значением поля error_data, но отсутствующим error_type', () => {
    expect(isVkError({ error_data: randomString(6) })).toBe(false);
  });

  it('Объект с произвольным значением поля error_data и неправильным error_type', () => {
    expect(
      isVkError({ error_data: randomString(6), error_type: randomString(6) })
    ).toBe(false);
  });

  vkErrorTypes.forEach((errorType) => {
    it(`Объект с произвольным error_data и error_type, равным "${errorType}"`, () => {
      expect(
        isVkError({ error_data: randomString(6), error_type: errorType })
      ).toBe(true);
    });
  });

  vkErrorTypes.forEach((errorType) => {
    it(
      'Объект с произвольным error_data, произвольным полем' +
        `и error_type, равным "${errorType}"`,
      () => {
        expect(
          isVkError({
            error_data: randomString(6),
            error_type: errorType,
            [randomString(6)]: randomNumberUpTo(100),
          })
        ).toBe(true);
      }
    );
  });
});
