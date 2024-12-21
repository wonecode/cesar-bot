import { execute as pingExecute, data as pingData } from './ping';
import { execute as inhouseExecute, data as inhouseData } from './inhouse';

export const commands = {
  ping: { data: pingData, execute: pingExecute },
  inhouse: { data: inhouseData, execute: inhouseExecute },
};
