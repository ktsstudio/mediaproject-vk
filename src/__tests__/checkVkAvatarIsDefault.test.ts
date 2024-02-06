import { CheckVkAvatarIsDefaultParamsType } from '../types';
import { checkVkAvatarIsDefault } from '../checkVkAvatarIsDefault';

import { randomString } from './utils';

type AvatarSize = Exclude<CheckVkAvatarIsDefaultParamsType['size'], undefined>;

type SizesPair = { sizeA: AvatarSize; sizeB: AvatarSize };

const PROPER_SIZES: AvatarSize[] = [400, 200, 100, 50];

const createVkPhotoLink = (size: number) =>
  `https://vk.com/images/camera_${size}.png`;

const createCorrectArg = (
  size: AvatarSize
): Required<CheckVkAvatarIsDefaultParamsType> => ({
  photo: createVkPhotoLink(size),
  size: size,
});

const createJpgImageArg = (
  size: AvatarSize
): Required<CheckVkAvatarIsDefaultParamsType> => ({
  photo: `https://vk.com/images/camera_${size}.jpg`,
  size,
});

const getNotEqualEachOtherSizes = (): SizesPair[] =>
  PROPER_SIZES.reduce<SizesPair[]>((acc, sizeA) => {
    const sizesPairsNotEqualToSizeA = PROPER_SIZES.reduce<SizesPair[]>(
      (arr, sizeB) => (sizeA !== sizeB ? [...arr, { sizeA, sizeB }] : arr),
      []
    );

    return [...acc, ...sizesPairsNotEqualToSizeA];
  }, []);

describe('Функция checkVkAvatarIsDefault', () => {
  PROPER_SIZES.map(createCorrectArg).forEach(({ size, photo }) => {
    it(`Правильная ссылка: ${photo}`, () => {
      expect(checkVkAvatarIsDefault({ photo, size })).toBeTruthy();
    });
  });

  PROPER_SIZES.map(createJpgImageArg).forEach(({ size, photo }) => {
    it(`Имитация ВКшной ссылки, jpg-расширение: ${photo}`, () => {
      expect(checkVkAvatarIsDefault({ photo, size })).toBeFalsy();
    });
  });

  PROPER_SIZES.forEach((size) => {
    it(`Случайная строка в поле ссылки. Размер: ${size}`, () => {
      expect(
        checkVkAvatarIsDefault({ photo: randomString(10), size })
      ).toBeFalsy();
    });
  });

  getNotEqualEachOtherSizes().forEach(({ sizeA, sizeB }) => {
    const link = createVkPhotoLink(sizeB);

    it(
      'Несоответствие размеров в аргументе в поле size и в ссылке. ' +
        `Ссылка: ${link}, размер: ${sizeA}`,
      () => {
        expect(
          checkVkAvatarIsDefault({ size: sizeA, photo: link })
        ).toBeFalsy();
      }
    );
  });

  PROPER_SIZES.forEach((size) => {
    it(`Пустая строка в поле ссылки. Размер: ${size}`, () => {
      expect(checkVkAvatarIsDefault({ photo: '', size })).toBeFalsy();
    });
  });
});
