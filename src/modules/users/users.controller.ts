import {
  Controller,
  Get,
  Param,
  UsePipes,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FindAllDto,
  FindByIdDto,
  WebUserDto,
  WebUsersAllDto,
  WebLoginParamDto,
  WebRegistrationParamDto,
  FindByIdsDto,
} from 'micro-dto';
import { JoiValidationPipe } from 'src/pipes/joi.validation.pipe';
import { UsersService } from './users.service';
import {
  loginJoi,
  findAllJoi,
  findByIdJoi,
  findByIdsJoi,
  registrationJoi,
} from './users.joi';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/login')
  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: WebUserDto,
  })
  @UsePipes(new JoiValidationPipe(loginJoi))
  async login(@Body() body: WebLoginParamDto): Promise<WebUserDto> {
    return this.usersService.login(body);
  }

  @Post('/registration')
  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Registration of new user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: WebUserDto,
  })
  @UsePipes(new JoiValidationPipe(registrationJoi))
  async registration(
    @Body() body: WebRegistrationParamDto,
  ): Promise<WebUserDto> {
    try {
      return await this.usersService.registration(body);
    } catch (error) {
      if (error?.code === 11000) {
        throw new BadRequestException('Duplicate user', {
          cause: error,
          description: 'User with same login or email already exists',
        });
      }

      throw new BadRequestException(error.message, {
        cause: error,
        description: error.message,
      });
    }
  }

  @Get('/find-all')
  @ApiTags('Users')
  @ApiOperation({ summary: 'List of users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: WebUsersAllDto,
  })
  @UsePipes(new JoiValidationPipe(findAllJoi))
  findAll(@Query() params: FindAllDto): Promise<WebUsersAllDto> {
    if (params.excludeIds && typeof params.excludeIds === 'string') {
      params.excludeIds = [params.excludeIds];
    }
    return this.usersService.findAll(params);
  }

  @Get('/find-one/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiTags('Users')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: WebUserDto,
  })
  @UsePipes(new JoiValidationPipe(findByIdJoi))
  findOne(@Param() params: FindByIdDto): Promise<WebUserDto> {
    return this.usersService.findById(params);
  }

  @Get('/find-by-ids')
  @ApiTags('Users')
  @ApiOperation({ summary: 'List of users by ids' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: WebUsersAllDto,
  })
  @UsePipes(new JoiValidationPipe(findByIdsJoi))
  findByIds(@Query() params: FindByIdsDto): Promise<WebUsersAllDto> {
    if (params.ids && typeof params.ids === 'string') {
      params.ids = [params.ids];
    }

    return this.usersService.findByIds(params);
  }
}
