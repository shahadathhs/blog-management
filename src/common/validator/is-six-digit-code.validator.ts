import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsSixDigitCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSixDigitCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const str = String(value).trim();
          return /^\d{6}$/.test(str); // Only passes if exactly 6 digits
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a 6-digit code`;
        },
      },
    });
  };
}
