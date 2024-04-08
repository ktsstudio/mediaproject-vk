type VkStatusesParamsType = {
  appId: number;
  accessToken?: string;
  onUserDeniedAccess?: VoidFunction;
  // eslint-disable-next-line
  onErrorOccurred?: (error?: any, errorData?: any) => void;
};

type SetVkStatusParamsType = VkStatusesParamsType & {
  statusId: number;
};

type VkApiStatusType = {
  id: number;
  images: { height: number; url: string; width: number }[];
  name: string;
};

export type { VkStatusesParamsType, SetVkStatusParamsType, VkApiStatusType };
