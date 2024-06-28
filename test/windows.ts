// Test only valid when ran from a Windows system
import { plan, test } from 'tap';

if (process.platform !== 'win32') {
  plan(0, 'Running on non-Windows system. Skipping Windows tests.');
  process.exit(0);
};

// Setting Windows-like environment variables
process.env.windir = 'c:\\windows';
process.env.USERDOMAIN = 'some-domain';
process.env.USERNAME = 'hersy';
process.env.USERPROFILE = 'C:\\Users\\hersy';
process.env.COMPUTERNAME = 'my-machine';
process.env.TMPDIR = 'C:\\tmpdir';
process.env.TMP = 'C:\\tmp';
process.env.TEMP = 'C:\\temp';
process.env.Path = 'C:\\Program Files\\;C:\\Binary Stuff\\bin';
process.env.PROMPT = '(o_o) $ ';
process.env.EDITOR = 'edit';
process.env.VISUAL = 'visualedit';
process.env.ComSpec = 'some-com';

test(
  'Basic Windows Recognition Test',
  (t) => {
    var osenv = require('../osenv.ts');

    t.equal(osenv.user(), process.env.USERDOMAIN + '\\' + process.env.USERNAME);
    t.equal(osenv.home(), process.env.USERPROFILE);
    t.equal(osenv.hostname(), process.env.COMPUTERNAME);
    t.same(osenv.path(), process.env.Path?.split(';'));
    t.equal(osenv.prompt(), process.env.PROMPT);
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
    t.equal(osenv.tmpdir(), 'c:\\windows\\temp');

    t.equal(osenv.editor(), 'edit');
    process.env.EDITOR = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.editor(), 'visualedit');

    process.env.VISUAL = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.editor(), 'notepad.exe');

    t.equal(osenv.shell(), 'some-com');
    process.env.ComSpec = '';
    delete require.cache[require.resolve('../osenv.ts')];
    var osenv = require('../osenv.ts');
    t.equal(osenv.shell(), 'cmd');

    t.end();
  }
);
