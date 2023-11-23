# GIT from Scratch

This is a simple git implementation made using the following resources

- [Write yourself a git](https://wyag.thb.lt/)
- [Build your own git](https://github.com/codecrafters-io/build-your-own-x#build-your-own-git)

I also documented my learning and some other resources [here](https://dheeraj120501.notion.site/Build-your-own-Git-13d94a5a1082416091f38ac9f3c49797?pvs=4).

## How to run

1. Make sure you have git and node installed in your system.
1. Clone the repo and cd into the project.
1. Run `npm i`.
1. Now run `./mygit -V` if it works then checkout the manual using `./mygit help` to see what commands are available.
   - A set of implemented commands are shown below in the table.

## Note for Windows users

`mygit` should run on any Unix-like system with node installed. The test suite absolutely requires a bash-compatible shell, which I assume the WSL can provide for windows user. Also, if you are using WSL, make sure your `mygit` file uses Unix-style line endings ([Solution for VS Code](https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix)).

## Implemented Features:

| Feature      | Status   | Difficulty |
| ------------ | -------- | ---------- |
| init         | &#x2611; | ⭐         |
| add          | &#x2610; |            |
| cat-file     | &#x2610; |            |
| check-ignore | &#x2610; |            |
| checkout     | &#x2610; |            |
| commit       | &#x2610; |            |
| hash-object  | &#x2610; |            |
| log          | &#x2610; |            |
| ls-files     | &#x2610; |            |
| ls-tree      | &#x2610; |            |
| rev-parse    | &#x2610; |            |
| rm           | &#x2610; |            |
| show-ref     | &#x2610; |            |
| status       | &#x2610; |            |
| tag          | &#x2610; |            |
| branch       | &#x2610; |            |
| clone        | &#x2610; |            |

## Dependencies

Git is a CLI application, so `commanderjs` is used to parse command-line arguments

Git uses a configuration file format that is basically Microsoft’s INI format. The `config-ini-parser` package can read and write these files.
