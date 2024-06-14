import { ErrorCallbacksType } from './common';

type VkStatusesParamsType = {
  appId: number;
  accessToken?: string;
  renewTokenIfExpired?: boolean;
} & ErrorCallbacksType;

type SetVkStatusParamsType = VkStatusesParamsType & {
  statusId: number;
};

type VkApiStatusType = {
  id: number;
  images: { height: number; url: string; width: number }[];
  name: string;
};

export type { VkStatusesParamsType, SetVkStatusParamsType, VkApiStatusType };
