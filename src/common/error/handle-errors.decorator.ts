import { simplifyError } from './handle-errors.simplify';

export function HandleErrors(customMessage?: string) {
  return function <T>(
    _target: T,
    propertyName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => Promise<any>>,
  ) {
    const method = descriptor.value;

    if (!method) return;

    descriptor.value = async function (
      ...args: Parameters<typeof method>
    ): Promise<ReturnType<typeof method>> {
      try {
        return await method.apply(this, args);
      } catch (error) {
        simplifyError(error, customMessage || `Failed to ${propertyName}`);
      }
    };
  };
}
