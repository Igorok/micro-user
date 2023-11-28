import {
  FindAllDto,
  repoRegistrationParamDto,
  userDto,
  usersListDto,
} from 'micro-dto';
import { userRepoEntity } from './common.mock';
import { findActiveUserDto, saveAnalysisDto } from 'src/dto/index.dto';
import { merge } from 'lodash';

const userModel = {};

export const usersRepoServiceMock = {
  findByLogin: jest.fn(
    (param: { login: string }): Promise<userDto | undefined> => {
      if (param.login === userRepoEntity.login) {
        return Promise.resolve(userRepoEntity);
      }
      if (param.login === userRepoEntity.login + 'blocked') {
        return Promise.resolve({
          ...userRepoEntity,
          active: false,
        });
      }
      return Promise.resolve(undefined);
    },
  ),

  registration: jest.fn(
    (
      registrationDto: repoRegistrationParamDto,
    ): Promise<userDto | undefined> => {
      return Promise.resolve(userRepoEntity);
    },
  ),

  findActiveUser: jest.fn(
    (param: findActiveUserDto): Promise<userDto | undefined> => {
      if (
        param.id === userRepoEntity.id ||
        param.login === userRepoEntity.login
      ) {
        return Promise.resolve(userRepoEntity);
      }

      return Promise.resolve(undefined);
    },
  ),

  findAll: jest.fn((param: FindAllDto): Promise<usersListDto> => {
    return Promise.resolve({
      users: [userRepoEntity],
      count: 1,
    });
  }),

  findByIds: jest.fn((param: FindAllDto): Promise<usersListDto> => {
    return Promise.resolve({
      users: [userRepoEntity],
      count: 1,
    });
  }),

  findById: jest.fn((param: { id: string }): Promise<userDto | undefined> => {
    const user = userModel[param.id] || userRepoEntity;
    if (param.id === userRepoEntity.id) {
      return Promise.resolve(user);
    }

    return Promise.resolve(undefined);
  }),

  saveAnalysis: jest.fn((param: saveAnalysisDto): Promise<any> => {
    const user = userModel[param.id] || userRepoEntity;
    userModel[param.id] = merge(user, param);

    return Promise.resolve(undefined);
  }),
};
