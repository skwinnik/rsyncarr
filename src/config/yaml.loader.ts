import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import { Logger } from '@nestjs/common';
import * as yaml from 'js-yaml';

const YAML_CONFIG_FILENAME = 'config.yaml';
const logger = new Logger('YamlLoader');

export default () => {
  const fileExists = existsSync(join(__dirname, YAML_CONFIG_FILENAME));
  if (!fileExists) {
    logger.warn('No config.yaml file found');
    return {};
  }
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, unknown>;
};
