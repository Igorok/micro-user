import { UsersHelper } from '../users.helper';
import { userPassword } from './common.mock';

describe('UsersHelper', () => {
  let generatedSalt;
  let generatedPassword;
  let usersHelper: UsersHelper;

  beforeEach(async () => {
    usersHelper = new UsersHelper();
  });

  it('generatePassword method', async () => {
    const { salt, password } = await usersHelper.generatePassword(userPassword);
    generatedSalt = salt;
    generatedPassword = password;

    expect(generatedSalt).toBeTruthy();
    expect(generatedPassword).toBeTruthy();
  });

  it('isMatchPassword method true', async () => {
    const isMatch = await usersHelper.isMatchPassword({
      passwordTyped: userPassword,
      salt: generatedSalt,
      password: generatedPassword,
    });

    expect(isMatch).toBeTruthy();
  });

  it('isMatchPassword method false', async () => {
    const isMatch = await usersHelper.isMatchPassword({
      passwordTyped: userPassword,
      salt: generatedSalt,
      password: generatedPassword + 'Wrong',
    });

    expect(isMatch).toBeFalsy();
  });
});
