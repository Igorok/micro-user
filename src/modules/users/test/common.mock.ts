export const userEntity = {
  id: '2c2220ad-582e-4aa3-90e6-c8789e6ace97',
  login: 'TestUserLogin',
  email: 'testUserEmail@localhost.com',
  active: true,
  created_at: new Date(),
};

export class CustomError extends Error {
  code: number;

  constructor({ message, code }) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

export const userPassword = 'TestUserPassword';
export const hashedSalt = '0b21bfc54411bbd1385740132622e600';
export const hashedPassword =
  'ee96ff1e400bf6db427d221731806f86e3f988e96e9dbb879894e48199a749b1';

export const userRepoEntity = {
  ...userEntity,
  salt: hashedSalt,
  password: hashedPassword,
};
