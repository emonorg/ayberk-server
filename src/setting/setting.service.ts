import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getSetting(key: string): Promise<SettingDocument | null> {
    return await this.settingModel.findOne({ key });
  }

  async addSetting(key: string, value: string): Promise<SettingDocument> {
    let setting = await this.settingModel.findOneAndUpdate({ key }, { value });
    if (!setting) {
      setting = await this.settingModel.create({ key, value });
    }
    return setting;
  }
}
