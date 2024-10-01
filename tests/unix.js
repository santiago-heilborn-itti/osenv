import t from 'tap';

if (process.platform === 'win32') {
  t.skip('Skipping Unix tests on non-Unix system');
  t.end();
  process.exit(0);
}

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

t.test('Basic Unix Recognition Test', async test => {
  let osenv = await import('../lib/index');

  test.equal(osenv.user(), process.env.USER);
  test.equal(osenv.home(), process.env.HOME);
  test.equal(osenv.hostname(), process.env.HOSTNAME);
  test.same(osenv.path(), process.env.PATH.split(':'));
  test.equal(osenv.prompt(), process.env.PS1);
  test.equal(osenv.tmpdir(), process.env.TMPDIR);

  // Adjusting environment variables to test fallback behavior
  process.env.TMPDIR = '';
  osenv = await import('../lib/index');
  test.equal(osenv.tmpdir(), process.env.TMP);

  process.env.TMP = '';
  osenv = await import('../lib/index');
  test.equal(osenv.tmpdir(), process.env.TEMP);

  process.env.TEMP = '';
  osenv = await import('../lib/index');
  osenv.home = () => null;
  test.equal(osenv.tmpdir(), '/tmp');

  test.equal(osenv.editor(), 'edit');
  process.env.EDITOR = '';
  osenv = await import('../lib/index');
  test.equal(osenv.editor(), 'visualedit');

  process.env.VISUAL = '';
  osenv = await import('../lib/index');
  test.equal(osenv.editor(), 'vim');

  test.equal(osenv.shell(), 'zsh');
  process.env.SHELL = '';
  osenv = await import('../lib/index');
  test.equal(osenv.shell(), 'bash');

  test.end();
});
