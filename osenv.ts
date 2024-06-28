import { exec } from 'child_process';
import { tmpdir, homedir } from 'os';
import { OsEnvKey } from './types';

const isWindows = process.platform === 'win32';

const memo = (
  key: OsEnvKey,
  lookup: () => string[] | string | undefined,
  fallback?: OsEnvKey,
 ) => {
  var fell = false;
  var falling = false;

  exports[key] = (cb: Function) => {
    var val = lookup();
    if (!val && !fell && !falling && fallback) {
      fell = true;
      falling = true;
      exec(fallback, (er, output) => {
        falling = false;
        if (er) {
          console.info(`OS env '${key}' not found. ${er}`);
          return er.message;
        };
        val = output.trim();
      });
    };

    exports[key] = (cb: Function) => {
      if (cb) {
        process.nextTick(cb.bind(null, null, val));
      };
      return val;
    };

    if (cb && !falling) {
      process.nextTick(cb.bind(null, null, val));
    };

    return val;
  };
};

memo(
  'user', 
  () => isWindows
    ? process.env.USERDOMAIN + '\\' + process.env.USERNAME
    : process.env.USER,
  'whoami'
);

memo(
  'prompt',
  () => isWindows
    ? process.env.PROMPT
    : process.env.PS1
);

memo(
  'hostname',
  () => isWindows
    ? process.env.COMPUTERNAME
    : process.env.HOSTNAME,
  'hostname'
);

memo('tmpdir', () => tmpdir());

memo('home', () => homedir());

memo(
  'path',
  () => (process.env.PATH || process.env.Path || process.env.path)?.split(isWindows ? ';' : ':')
);

memo(
  'editor',
  () => process.env.EDITOR || process.env.VISUAL || (isWindows ? 'notepad.exe' : 'vim')
);

memo(
  'shell',
  () => isWindows
    ? process.env.ComSpec || 'cmd'
    : process.env.SHELL || 'bash'
);
