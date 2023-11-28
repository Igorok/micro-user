import { generatedPasswordDto, isMatchPasswordDto } from 'src/dto/index.dto';
import { hashedPassword, hashedSalt, userPassword } from './common.mock';

export const usersHelperMock = {
  generatePassword: jest.fn(
    (password: string): Promise<generatedPasswordDto> => {
      return Promise.resolve({
        password: hashedPassword,
        salt: hashedSalt,
      });
    },
  ),
  isMatchPassword: jest.fn(
    ({
      passwordTyped,
      salt,
      password,
    }: isMatchPasswordDto): Promise<boolean> => {
      if (
        passwordTyped === userPassword &&
        salt === hashedSalt &&
        password === hashedPassword
      ) {
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    },
  ),
};
