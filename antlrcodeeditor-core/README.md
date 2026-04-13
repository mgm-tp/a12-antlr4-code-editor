# Antlr Code Editor Core
The Antlr Code Editor core is a code editor widget that supports syntax validation, syntax highlighting and
autosuggestion based on any Antlr4 grammar.

## How to Use It
### Prerequisites

* An A12 based application with Form Engine configured.

### Install

```shell script
npm install @com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core
```

**Note:** Antlr Code Editor core requires `@monaco-editor/react` and `monaco-editor` as peer dependencies in the host
application.

### Components

#### AntlrCodeEditor

`AntlrCodeEditor` is the basic component takes all the configurations and renders the actual Code Editor.
You can freely customize its behaviors and UI appearance.

To use the above component in the A12 Form Engine context, you have to write your glue code for configuring the Code
Editor.

Kindly
see [DefaultCustomFormEngineView.tsx](../code-editor-in-bap-example/src/modules/defaultCustomFormEngineView/DefaultCustomFormEngineView.tsx)
for a brief code example.
