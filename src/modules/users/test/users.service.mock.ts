import {
  WebUserDto,
  FindByIdDto,
  WebLoginParamDto,
  FindAllDto,
  WebUsersAllDto,
  FindByIdsDto,
  messageAnalysisDto,
  WebRegistrationParamDto,
} from 'micro-dto';

import { CustomError, userEntity } from './common.mock';

export const usersServiceMock = {
  login: jest.fn((loginDto: WebLoginParamDto): Promise<WebUserDto> => {
    return Promise.resolve(userEntity);
  }),
  registration: jest.fn(
    (registrationDto: WebRegistrationParamDto): Promise<WebUserDto> => {
      if (registrationDto.login !== userEntity.login) {
        throw new CustomError({
          message:
            'MongoServerError: E11000 duplicate key error collection: micro_users.users index: login_1 dup key: { login: "TestUserLogin" }',
          code: 11000,
        });
      }

      return Promise.resolve(userEntity);
    },
  ),
  findById: jest.fn(
    (findOneParam: FindByIdDto): Promise<WebUserDto | undefined> => {
      return Promise.resolve(userEntity);
    },
  ),
  findAll: jest.fn((param: FindAllDto): Promise<WebUsersAllDto | undefined> => {
    return Promise.resolve({
      count: 1,
      users: [userEntity],
    });
  }),
  findByIds: jest.fn(
    (param: FindByIdsDto): Promise<WebUsersAllDto | undefined> => {
      return Promise.resolve({
        count: 1,
        users: [userEntity],
      });
    },
  ),
  receiveAnalysis: jest.fn(
    (param: { id: string; analysis: messageAnalysisDto }): Promise<any> => {
      return Promise.resolve();
    },
  ),
};
