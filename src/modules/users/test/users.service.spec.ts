import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersHelper } from '../users.helper';
import { UsersService } from '../users.service';
import { UsersRepoService } from 'src/modules/users-repo/users.repo.service';
import { userEntity, userPassword } from './common.mock';
import { usersHelperMock } from './users.helper.mock';
import { usersRepoServiceMock } from './users.repo.service.mock';

const configServiceMock = {
  get: jest.fn((key: string): any => {
    if (key === 'VIOLATION_LIMIT') {
      return 2;
    }
  }),
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      exports: [UsersService],
      providers: [
        UsersService,
        {
          provide: UsersHelper,
          useValue: usersHelperMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: UsersRepoService,
          useValue: usersRepoServiceMock,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('login method success', async () => {
    expect(
      await usersService.login({
        login: userEntity.login,
        password: userPassword,
      }),
    ).toEqual(userEntity);
  });

  it('login method no login', async () => {
    await expect(
      usersService.login({ login: undefined, password: undefined }),
    ).rejects.toThrow('User not found');
  });

  it('login method user not found', async () => {
    await expect(
      usersService.login({
        login: userEntity.login + 'wrong',
        password: userPassword,
      }),
    ).rejects.toThrow('User not found');
  });

  it('login method user blocked', async () => {
    await expect(
      usersService.login({
        login: userEntity.login + 'blocked',
        password: userPassword,
      }),
    ).rejects.toThrow('User blocked');
  });

  it('login method password invalid', async () => {
    await expect(
      usersService.login({
        login: userEntity.login,
        password: userPassword + 'wrong',
      }),
    ).rejects.toThrow('Password invalid');
  });

  it('registration method success', async () => {
    expect(
      await usersService.registration({
        login: userEntity.login,
        email: userEntity.email,
        password: userPassword,
        passwordRepeat: userPassword,
      }),
    ).toEqual(userEntity);
  });

  it('findById success', async () => {
    expect(await usersService.findById({ id: userEntity.id })).toEqual(
      userEntity,
    );
  });

  it('findById no id', async () => {
    expect(await usersService.findById({ id: undefined })).toBeFalsy();
  });

  it('findById not found', async () => {
    expect(
      await usersService.findById({ id: userEntity.id + 'notFound' }),
    ).toBeFalsy();
  });

  it('findAll success', async () => {
    expect(await usersService.findAll({})).toEqual({
      users: [userEntity],
      count: 1,
    });
  });

  it('findByIds success', async () => {
    expect(await usersService.findByIds({ ids: [userEntity.id] })).toEqual({
      users: [userEntity],
      count: 1,
    });
  });

  it('receiveAnalysis success', async () => {
    const analysis = {
      id: userEntity.id,
      analysis: {
        spam: true,
        toxic: true,
        severe_toxic: true,
        obscene: true,
        threat: true,
        insult: true,
        identity_hate: true,
      },
    };

    await usersService.receiveAnalysis(analysis);
    expect(usersRepoServiceMock.saveAnalysis.mock.calls[0][0]).toEqual({
      id: userEntity.id,
      analysis: {
        spam: 1,
        toxic: 1,
        severe_toxic: 1,
        obscene: 1,
        threat: 1,
        insult: 1,
        identity_hate: 1,
      },
    });
    await usersService.receiveAnalysis(analysis);
    expect(usersRepoServiceMock.saveAnalysis.mock.calls[1][0]).toEqual({
      id: userEntity.id,
      analysis: {
        spam: 2,
        toxic: 2,
        severe_toxic: 2,
        obscene: 2,
        threat: 2,
        insult: 2,
        identity_hate: 2,
      },
      active: false,
    });
  });
});
