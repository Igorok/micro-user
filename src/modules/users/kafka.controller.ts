import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';
import {
  Controller,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { messageAnalysisDto } from 'micro-dto';
import { UsersService } from './users.service';

@Controller()
export class KafkaController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(KafkaController.name);

  private readonly kafka: Kafka = new Kafka({
    clientId: 'user_service',
    brokers: [this.configService.get<string>('KAFKA_URI')],
  });

  private readonly analysisConsumer: Consumer = this.kafka.consumer({
    groupId: this.configService.get<string>('KAFKA_ANALYSIS_MESSAGE_GROUP'),
  });

  async onModuleInit() {
    try {
      await this.analysisConsumer.subscribe({
        topic: this.configService.get<string>('KAFKA_ANALYSIS_MESSAGE_TOPIC'),
        fromBeginning: true,
      });
      await this.analysisConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          this.receiveAnalysis(message);
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.analysisConsumer.disconnect();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async receiveAnalysis(params: KafkaMessage) {
    try {
      const messageValue: { user_id: string; analysis: messageAnalysisDto } =
        JSON.parse(params.value.toString());
      const { user_id: id, analysis } = messageValue;
      await this.usersService.receiveAnalysis({ id, analysis });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
