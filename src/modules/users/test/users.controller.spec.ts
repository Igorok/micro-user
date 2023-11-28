import { Test } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import { usersServiceMock } from './users.service.mock';

import { userEntity, userPassword } from './common.mock';

describe('UsersController', () => {
  let userController: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    userController = moduleRef.get<UsersController>(UsersController);
  });

  it('login action', async () => {
    expect(
      await userController.login({
        login: userEntity.login,
        password: userPassword,
      }),
    ).toEqual(userEntity);
  });

  it('registration action success', async () => {
    const param = {
      login: userEntity.login,
      email: userEntity.email,
      password: userPassword,
      passwordRepeat: userPassword,
    };
    expect(await userController.registration(param)).toEqual(userEntity);
  });

  it('registration action error', async () => {
    const param = {
      login: `${userEntity.login}_duplicate_user`,
      email: userEntity.email,
      password: userPassword,
      passwordRepeat: userPassword,
    };

    await expect(userController.registration(param)).rejects.toThrow(
      'Duplicate user',
    );
  });

  it('findAll action', async () => {
    expect(await userController.findAll({})).toEqual({
      count: 1,
      users: [userEntity],
    });
  });

  it('findOne action', async () => {
    expect(await userController.findOne({ id: userEntity.id })).toEqual(
      userEntity,
    );
  });

  it('findByIds action', async () => {
    expect(await userController.findByIds({ ids: [userEntity.id] })).toEqual({
      count: 1,
      users: [userEntity],
    });
  });
});
