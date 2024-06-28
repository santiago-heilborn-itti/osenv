// Test only valid when ran from an Unix system
import { plan, test } from 'tap';

if (process.platform === 'win32') {
  plan(0, 'Running on non-Unix system. Skipping Unix tests.');
  process.exit(0);
};

// Setting Unix-like environment variables
process.env.USER = 'hersy';
process.env.HOME = '/home/hersy';
process.env.HOSTNAME = 'my-machine';
process.env.TMPDIR = '/tmpdir';
process.env.TMP = '/tmp';
process.env.TEMP = '/temp';
process.env.PATH = '/opt/local/bin:/usr/local/bin:/usr/bin/:bin';
process.env.PS1 = '(o_o) $ ';
process.env.EDITOR = 'edit';
process.env.VISUAL = 'visualedit';
process.env.SHELL = 'zsh';

test(
  'Basic Unix Recognition Test',
  (t) => {
    var osenv = require('../osenv.ts');

    t.equal(osenv.user(), process.env.USER);
    t.equal(osenv.home(), process.env.HOME);
    t.equal(osenv.hostname(), process.env.HOSTNAME);
    t.same(osenv.path(), process.env.PATH?.split(':'));
    t.equal(osenv.prompt(), process.env.PS1);
    t.equal(osenv.tmpdir(), process.env.TMPDIR);

    // increasing test difficulty by clearing temporal directory envs
    process.env.TMPDIR = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.tmpdir(), process.env.TMP);

    process.env.TMP = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.tmpdir(), process.env.TEMP);

    process.env.TEMP = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    osenv.home = () => null;
    t.equal(osenv.tmpdir(), '/tmp');

    t.equal(osenv.editor(), 'edit');
    process.env.EDITOR = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.editor(), 'visualedit');

    process.env.VISUAL = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.editor(), 'vim');

    t.equal(osenv.shell(), 'zsh');
    process.env.SHELL = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.shell(), 'bash');

    t.end();
  }
);
