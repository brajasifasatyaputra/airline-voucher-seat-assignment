import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VouchersModule } from './vouchers/vouchers.module';
import { Voucher } from './vouchers/entities/voucher.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'vouchers.db', 
      entities: [Voucher],
      synchronize: true, 
    }),
    VouchersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}