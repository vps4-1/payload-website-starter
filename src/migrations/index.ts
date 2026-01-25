import * as migration_20260125_034429_api_key_fields from './20260125_034429_api_key_fields';

export const migrations = [
  {
    up: migration_20260125_034429_api_key_fields.up,
    down: migration_20260125_034429_api_key_fields.down,
    name: '20260125_034429_api_key_fields'
  },
];
