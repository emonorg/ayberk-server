import { Injectable, Logger } from '@nestjs/common';
import { OperatorService } from './operator/operator.service';
import { SettingService } from './setting/setting.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger('Ayberk');
  constructor(
    private settingService: SettingService,
    private operatorService: OperatorService,
  ) {
    this.setupAyberk();
  }

  async setupAyberk() {
    this.logger.log('Check if Ayberk has been setup before...');
    const serviceSetupSuccessful = await this.settingService.getSetting(
      'service.setup.successful',
    );
    if (serviceSetupSuccessful?.value === 'true') {
      await this.settingService.addSetting(
        'service.setup.last.datetime',
        new Date().toISOString(),
      );
      this.logger.log('Ayberk found settings in the database.');
      this.logger.log('Ayberk is ready!');
      return;
    }

    this.logger.log('No Settings found! Creating root operator...');
    const operator = await this.operatorService.setup_createRootOperator();
    if (operator)
      this.logger.log('Root operator has been created successfully');

    await this.settingService.addSetting('service.setup.successful', 'true');
    await this.settingService.addSetting(
      'service.setup.first.datetime',
      new Date().toISOString(),
    );

    this.logger.log('Ayberk is ready!');
  }
}
