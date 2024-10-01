# @hersy/osenv

Look up environment settings specific to different operating systems.
Forked from <a href="https://github.com/npm/osenv">Isaac's official osenv node package repository</a>.
Now patched and maintained by Santiago "Hersy" Heilborn.


## Installation

### Set your GITHUB_TOKEN environment variable

To install this (and any other GitHub) packages, you'll first need to set the **GITHUB_TOKEN** environment variable.
To do this you'll first need to create a GitHub Token (classic), you can do so on the "Developer options" section of your GitHub settings page.
For more instructions, read [GitHub's documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).

Once set, add your access token to your preferred terminal's user profile file.

On Windows, WindowsPowerShell is recommended, locate or create your user profile file, usually saved on **%USERPROFILE%/Documents/WindowsPowerShell/Microsoft.Powershell_profile.ps1**, and add this line:

```powershell
$Env:GITHUB_TOKEN="<Your Token>"
```

On MacOS, locate or create your default terminal's user profile file.

For **bash** terminals it can be found at **~/.bashrc**
For **zsh** terminals it can be found at **~/.zshrc**

Then add this line:

```bash
export GITHUB_TOKEN="<Your Token>"
```

### Resolve to GitHub Package Registry

Locate or create your NPM configuration file, usually saved on **./.npmrc** , it should contain the following:

```npmrc
registry=https://registry.npmjs.org/ # or https://registry.yarnpkg.com/
@hersy:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Install the package

Now you can run either:

```bash
npm install --save @hersy/osenv
```

or

```bash
yarn add -D @hersy/osenv
```

And you're all set!

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
