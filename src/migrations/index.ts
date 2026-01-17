import * as migration_20260105_201500_initial from './20260105_201500_initial';
import * as migration_20260117_101141 from './20260117_101141';

export const migrations = [
  {
    up: migration_20260105_201500_initial.up,
    down: migration_20260105_201500_initial.down,
    name: '20260105_201500_initial',
  },
  {
    up: migration_20260117_101141.up,
    down: migration_20260117_101141.down,
    name: '20260117_101141'
  },
];
