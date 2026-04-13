# Antlr Code Editor Build Tool

This is a tool for generating the Lexer, the Parser and the theming file from the Antlr4 grammar.
The Antlr Code Editor reads the grammar rules from these files.

## How to Use It

### Prerequisites

| Tool   | Version |
|--------|--------:|
| Gradle |   `8.x` |
| JDK    |  `21.x` |

### Install

Install as a dev dependency in your project

```shell script
npm i --save-dev @com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-build-tool
```

Install as globally

```shell script
npm i -g @com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-build-tool
```

### Usage

Run the CLI tool with options:

```shell script
antlr4-buildtool <command> <options>
```

**You can also use `--config` to pass the path of a JSON config file for options**

To know more about parameters and usage, run:

```shell script
antlr4-buildtool -h
```

#### Commands and Options

```shell script
Commands:
  runBuildTool                              Run build tool with only Lexer and Parser files
  runBuildToolWithBaseClassesSupport        Run the build tool with base classes
  runBuildToolWithSingleGrammarFileSupport  Run the build tool with a single grammar file

Options:
    Required in all cases options:
      --antlr-src, -s   Path to Antlr source files               [string] [required]
      --language, -n    Language name                            [string] [required]
      --target-dir, -t  Target to copy the result to             [string] [required]

    Required options when building with Lexer and Parser files:
      --lexer-name, -l   Lexer name                                         [string]
      --parser-name, -p  Parser name                                        [string]

    Required options when building with BaseLexer and BaseParser files:
      --lexer-name, -l          Lexer name                                  [string]
      --parser-name, -p         Parser name                                 [string]
      --base-lexer-name, --bl   Name of the Base Lexer file                 [string]
      --base-parser-name, --bp  Name of the Base Parser file                [string]

    Required option when building with single grammar file
      --grammar-file, -g  Name of the grammar file                          [string]

    Other options
      --version   Show version number                                      [boolean]
      --init-script, -I  Init script for Gradle                             [string]
      --config    Path to JSON config file
      --help, -h  Show help                                                [boolean]
```

### Use Cases

There are 3 cases where you find your grammar fall into:

1. Your grammar has 1 Lexer file and 1 Parser file
2. Your grammar requires additional Base Lexer and Base Parser (our build-tool only supports if Base classes are
   JavaScript)
3. Your grammar only has a single grammar file

#### Example AntlrBuildToolConfig.Json for Each Case

Case 1 (default):

```json
{
	"antlr-src": "resources/grammar",
	"language": "example",
	"target-dir": "src/config/grammar",
	"lexer-name": "ScssLexer",
	"parser-name": "ScssParser"
}
```

Case 2:

```json
{
	"antlr-src": "resources/grammar-with-base-classes",
	"language": "example",
	"target-dir": "src/config/grammar",
	"lexer-name": "TJSLexer",
	"parser-name": "TJSParser",
	"base-lexer-name": "TJSBaseLexer",
	"base-parser-name": "TJSBaseParser"
}
```

Case 3:

```json
{
	"antlr-src": "resources/grammar-with-single-file",
	"language": "example",
	"target-dir": "src/config/grammar",
	"grammar-file": "http"
}
```

### Language Theming Configuration Guideline

By default, the generated theming file uses the blue `foreground` for all tokens,
and an additional `UNNAMED` token with the black `foreground`.
You can also configure `background` color and `fontStyle` for each kind of token.
You need to manually config color theming for each language token.
