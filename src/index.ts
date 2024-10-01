/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { exec } from 'child_process';
import { tmpdir as tmpDir, homedir } from 'os';

export type OsEnvKey =
  | 'user'
  | 'prompt'
  | 'hostname'
  | 'tmpdir'
  | 'home'
  | 'path'
  | 'editor'
  | 'shell'
  | 'whoami';

const isWindows = process.platform === 'win32';

const memo = (
  key: OsEnvKey,
  lookup: () => string[] | string | undefined,
  fallback?: OsEnvKey,
): ((
  cb?: (
    readonlyerr: Error | null,
    result: string | string[] | undefined,
  ) => void,
) => string | string[] | undefined) => {
  let fell = false;
  let falling = false;

  const memoizedFunc = (
    cb?: (
      readonlyerr: Error | null,
      result: string | string[] | undefined,
    ) => void,
  ): string | string[] | undefined => {
    let val = lookup();
    if (!val && !fell && !falling && fallback) {
      fell = true;
      falling = true;
      exec(fallback, (er, output) => {
        falling = false;
        if (er) {
          // eslint-disable-next-line no-console
          console.info(`OS env '${key}' not found. ${er.message}`);
          throw new Error(er.message);
        }
        val = output.trim();
      });
    }
    if (cb && !falling) {
      process.nextTick(() => {
        cb(null, val);
      });
    }
    return val;
  };

  return memoizedFunc;
};

export const user = memo(
  'user',
  () =>
    isWindows
      ? `${process.env.USERDOMAIN}\\${process.env.USERNAME}`
      : process.env.USER,
  'whoami',
);

export const prompt = memo('prompt', () =>
  isWindows ? process.env.PROMPT : process.env.PS1,
);

export const hostname = memo(
  'hostname',
  () => (isWindows ? process.env.COMPUTERNAME : process.env.HOSTNAME),
  'hostname',
);

export const tmpdir = memo('tmpdir', () => tmpDir());

export const home = memo('home', () => homedir());

export const path = memo('path', () =>
  (process.env.PATH || process.env.Path || process.env.path)?.split(
    isWindows ? ';' : ':',
  ),
);

export const editor = memo(
  'editor',
  () =>
    process.env.EDITOR ||
    process.env.VISUAL ||
    (isWindows ? 'notepad.exe' : 'vim'),
);

export const shell = memo('shell', () =>
  isWindows ? process.env.ComSpec || 'cmd' : process.env.SHELL || 'bash',
);
