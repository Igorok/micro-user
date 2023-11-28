import { Module } from '@nestjs/common';
import { UsersHelper } from './users.helper';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KafkaController } from './kafka.controller';
import { UsersRepoModule } from 'src/modules/users-repo/users.repo.module';

@Module({
  providers: [UsersService, UsersHelper],
  exports: [UsersService],
  controllers: [UsersController, KafkaController],
  imports: [UsersRepoModule],
})
export class UsersModule {}
