# @hersy/osenv

Look up environment settings specific to different operating systems.
Forked from <a href="https://github.com/npm/osenv">Isaac's official osenv node package repository</a>.
Now patched and maintained by Santiago "Hersy" Heilborn.

## Usage

```typescript
const osenv = require('osenv');
const path = osenv.path();
const user = osenv.user();

// For values not reliably set on os's environment a fallback param is provided
var h;
osenv.hostname((er, hostname) => {
  h = hostname;
});
// Lookup results like above's are cached, so further calls such as:
const h = osenv.hostname();
// will be immediate operations.

// Using a callback param will take a single tick if the value is cached.
// If not, it will request the necessary fallback data to determine the os's env value, and wait for it.
osenv.hostname((er, hostname) => {
  if (er) {
    console.error(`Host system's name not found. ${er}`);
  } else {
    console.log(`Host system's name: ${hostname}`);
  };
});
```

## osenv.hostname()

The machine's name. Calls `hostname` if not found.

## osenv.user()

The currently logged-in user. Calls `whoami` if not found.

## osenv.prompt()

The primary command interface's startup prompt. Retrieved from `ps1` on Unix, and `prompt` on Windows.

## osenv.tmpdir()

The temporary file creation directory.

## osenv.home()

The path to the currently logged-in user's home directory.

## osenv.path()

The list of directories from which the system reads it's global executable binaries.

## osenv.editor() 

The name of the system's default text editor's executable. Retrieved from either the `EDITOR` or `VISUAL` environment variables. Falls back to `vim` on Unix, and `notepad.exe` on Windows.

## osenv.shell()

The name of the system's default command terminal. Retrieved from `SHELL` on Unix, and `ComSpec` on Windows. Falls back to `bash` on Unix, and `cmd` on Windows.
