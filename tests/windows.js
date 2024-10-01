import t from 'tap';

if (process.platform !== 'win32') {
  t.skip('Skipping Windows tests on non-Windows system');
  t.end();
  process.exit(0);
}

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

t.test('Basic Windows Recognition Test', async test => {
  let osenv = await import('../lib/index');

  test.equal(
    osenv.user(),
    `${process.env.USERDOMAIN}\\${process.env.USERNAME}`,
  );
  test.equal(osenv.home(), process.env.USERPROFILE);
  test.equal(osenv.hostname(), process.env.COMPUTERNAME);
  test.same(osenv.path(), process.env.Path.split(';'));
  test.equal(osenv.prompt(), process.env.PROMPT);
  test.equal(osenv.tmpdir(), process.env.TEMP);

  // Testing with modified environment variables
  process.env.TMPDIR = '';
  osenv = await import('../lib/index');
  test.equal(osenv.tmpdir(), process.env.TEMP);

  process.env.TEMP = '';
  osenv = await import('../lib/index');
  test.equal(osenv.tmpdir(), process.env.TMP);

  process.env.TMP = '';
  osenv = await import('../lib/index');
  osenv.home = () => null;
  test.equal(osenv.tmpdir(), 'C:\\WINDOWS\\temp');

  test.equal(osenv.editor(), 'edit');
  process.env.EDITOR = '';
  osenv = await import('../lib/index');
  test.equal(osenv.editor(), 'visualedit');

  test.equal(osenv.shell(), 'some-com');
  process.env.ComSpec = 'cmd';
  osenv = await import('../lib/index');
  test.equal(osenv.shell(), 'cmd');

  test.end();
});
