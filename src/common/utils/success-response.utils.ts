export type TSuccessResponse = {
  success: boolean;
  message: string;
  data: any;
};

export const successResponse = (data: any, message = 'Success') => ({
  success: true,
  message,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  data,
});
