<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/dark/A12-Dark.svg" />
  <img src="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/light/A12-Light.svg" height="200" alt="A12 logo" />
</picture>

# Antlr Code Editor

The code editor component for an Antlr4 based domain specific language in A12 project. The component supports syntax
validation, highlighting and auto-suggestion based on Antlr4 grammar.

Refer to https://geta12.com/#/docs to get started with A12 development

---

## License

Parts of the A12 platform are made available under a **dual license**.  
Please check the [LICENSE](./LICENSE) file for details.

---

## Getting Started

### How to Use It

Please refer detailed documentations under:

* [antlrcodeeditor-build-tool](./antlrcodeeditor-build-tool/README.MD) - Generate grammar definition files in
  `javascript` from Antlr4 grammar.
* [antlrcodeeditor-core](./antlrcodeeditor-core/README.md) - A customizable grammar independent Code Editor based on
  Antlr4 grammar.
* [code-editor-in-bap-example](./code-editor-in-bap-example/README.md) - A showcase application with A12 Client and Code
  Editor component.

---

### How to Build and Run

#### Prerequisites

The following tools are required in order to build this repository:

| Tool   |  Version |
|--------|---------:|
| Gradle |    `8.x` |
| JDK    |   `21.x` |
| Node   |   `22.x` |
| npm    |   `10.x` |
| pnpm   | `10.8.1` |

#### How to Build

Install all required libraries by running following commands in the root directory:

```sh
pnpm install
pnpm bootstrap
```

Build all packages:

```sh
pnpm build
```

This will execute the build in all packages, which includes:

* Compiling TypeScript source in `antlrcodeeditor-core` to JavaScript
* Bundle the example showcase using Webpack

#### How to Run

Start the project in development mode:

```sh
pnpm start
```

This command starts the dev server and runs Typescript compiler in watch mode.

#### How to Access It

Open browser, the example showcase should be available at http://localhost:8080/

#### Code Quality

ESLint and Prettier are already configured to lint/format TypeScript code. For the best development experience:

* Install ESLint and Prettier plugins for your IDE
* Enable format on save in your IDE settings

Run linting:

```sh
pnpm lint
```

---

### Documentation

- Full technical documentation is available at [GetA12.com](https://GetA12.com).
- The website also provides access to the **A12 Discourse Community Forum**.

---

**The mgm A12 Team**

[mgm technology partners GmbH](https://www.mgm-tp.com) • [Imprint](https://www.mgm-tp.com/imprint.html)
