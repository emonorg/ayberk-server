import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OperatorService } from './operator/operator.service';
import { SettingService } from './setting/setting.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger('Ayberk');
  constructor(
    private settingService: SettingService,
    private operatorService: OperatorService,
    private configService: ConfigService,
  ) {
    this.setupAyberk();
  }

  public logMem: string[] = [];

  AYBERK_VERSION = 'beta-0.0.0';
  startTime = null;

  async setupAyberk() {
    this.startTime = new Date();
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
      await this.logReadyStatus();
      await this.internal_memAppend('AYBERK_SETTINGS_FOUND');
      return;
    }

    this.logger.log('No Settings found! Creating root operator...');
    await this.internal_memAppend('AYBERK_SETTINGS_NOT_FOUND');

    const operator = await this.operatorService.createRootOperator();
    if (operator) {
      this.logger.log('Root operator has been created successfully');
      await this.internal_memAppend('AYBERK_ROOT_OPERATOR_CREATED');
    }

    await this.settingService.addSetting('service.setup.successful', 'true');
    await this.settingService.addSetting(
      'service.setup.first.datetime',
      new Date().toISOString(),
    );

    await this.logReadyStatus();
  }

  async internal_memAppend(value: any) {
    this.logMem.push(value);
  }

  async logReadyStatus() {
    this.logger.log('version: ' + this.AYBERK_VERSION);
    this.logger.log('Database: ' + this.configService.get('database.database'));
    this.logger.log('Ayberk is ready!');
    await this.internal_memAppend('AYBERK_SERVICE_SETUP_SUCCESSFUL');
  }
}
