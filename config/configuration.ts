import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './config.yaml';
const YAML_TEST_CONFIG_FILENAME = './config-test.yaml';

const ENV = process.env.NODE_ENV;

export default () => {
  return yaml.load(
    readFileSync(
      join(__dirname, !ENV ? YAML_CONFIG_FILENAME : YAML_TEST_CONFIG_FILENAME),
      'utf8',
    ),
  ) as Record<string, any>;
};
