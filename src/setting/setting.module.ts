import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './models/setting.model';
import { SettingService } from './setting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Setting.name,
        schema: SettingSchema,
      },
    ]),
  ],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
