import { css, FlattenSimpleInterpolation } from 'styled-components';

export const headerCenterElement = (
  ...restTransform: string[]
): FlattenSimpleInterpolation => css`
  top: calc(
    var(--vkui_internal--safe_area_inset_top) +
      var(--vkui--size_panel_header_height--regular) / 2
  );
  transform: translateY(-50%) ${restTransform.join(' ')};
`;
