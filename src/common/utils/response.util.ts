export type TSuccessResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export const successResponse = <T>(
  data: T,
  message = 'Success',
): TSuccessResponse<T> => ({
  success: true,
  message,
  data,
});
