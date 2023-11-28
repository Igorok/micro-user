import { BadRequestException, Injectable } from '@nestjs/common';
import {
  WebUserDto,
  FindByIdDto,
  WebLoginParamDto,
  WebRegistrationParamDto,
  FindAllDto,
  WebUsersAllDto,
  FindByIdsDto,
  userDto,
  messageAnalysisDto,
  userAnalysisDto,
} from 'micro-dto';
import { saveAnalysisDto } from 'src/dto/index.dto';
import { UsersHelper } from './users.helper';
import { ConfigService } from '@nestjs/config';
import { UsersRepoService } from 'src/modules/users-repo/users.repo.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepoService: UsersRepoService,
    private usersHelper: UsersHelper,
    private configService: ConfigService,
  ) {}

  async login(loginDto: WebLoginParamDto): Promise<WebUserDto> {
    if (!loginDto.login) {
      throw new BadRequestException('User not found');
    }
    const user = await this.usersRepoService.findByLogin(loginDto);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.active) {
      throw new BadRequestException('User blocked');
    }

    const isMatch = await this.usersHelper.isMatchPassword({
      passwordTyped: loginDto.password,
      salt: user.salt,
      password: user.password,
    });
    if (!isMatch) {
      throw new BadRequestException('Password invalid');
    }
    const { id, login, email, active, created_at } = user;

    return { id: id, login, email, active, created_at };
  }

  async registration(
    registrationDto: WebRegistrationParamDto,
  ): Promise<WebUserDto> {
    const { password, salt } = await this.usersHelper.generatePassword(
      registrationDto.password,
    );

    const { id, login, email, active, created_at } =
      await this.usersRepoService.registration({
        ...registrationDto,
        password,
        salt,
        active: true,
        created_at: new Date(),
      });
    return { id, login, email, active, created_at };
  }

  async findById(findOneParam: FindByIdDto): Promise<WebUserDto | undefined> {
    const user = await this.usersRepoService.findActiveUser(findOneParam);
    if (!user) {
      return;
    }
    const { id, login, email, active, created_at } = user;
    return { id: id, login, email, active, created_at };
  }

  async findAll(param: FindAllDto): Promise<WebUsersAllDto | undefined> {
    const usersList = await this.usersRepoService.findAll(param);
    usersList.users = usersList.users.map((user: userDto) => {
      const { id, login, email, active, created_at } = user;

      return { id, login, email, active, created_at };
    });

    return usersList;
  }

  async findByIds(param: FindByIdsDto): Promise<WebUsersAllDto | undefined> {
    const usersList = await this.usersRepoService.findByIds(param);
    usersList.users = usersList.users.map((user: userDto) => {
      const { id, login, email, active, created_at } = user;

      return { id, login, email, active, created_at };
    });

    return usersList;
  }

  async receiveAnalysis(param: {
    id: string;
    analysis: messageAnalysisDto;
  }): Promise<any> {
    const { id, analysis } = param;
    const user = await this.usersRepoService.findById({ id });
    if (!user) {
      return;
    }

    const newAnalysis: userAnalysisDto = [
      'spam',
      'toxic',
      'severe_toxic',
      'obscene',
      'threat',
      'insult',
      'identity_hate',
    ].reduce((acc, key) => {
      acc[key] = user.analysis?.[key] || 0;
      if (analysis[key]) {
        acc[key] += 1;
      }
      return acc;
    }, {});

    const violationLimit = this.configService.get<number>('VIOLATION_LIMIT');
    const violationCount = newAnalysis.toxic + newAnalysis.spam;
    const updateParam: saveAnalysisDto = {
      id: user.id,
      analysis: newAnalysis,
    };

    if (violationCount > violationLimit) {
      updateParam.active = false;
    }

    await this.usersRepoService.saveAnalysis(updateParam);
  }
}
