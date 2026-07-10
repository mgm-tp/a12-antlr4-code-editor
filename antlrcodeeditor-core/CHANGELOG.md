# Changelog

**Legend:**

- [BAPExample] = Changes in the A12 BAP Client example
- [BuildTool] = Changes in the antlr build tool
- [CodeEditor] = Changes in the Antlr code editor
- [Dev] = General changes in the dev environment

## [7.0.0 / 2026-04-28]
### Changed
* A12 technical upgrade 2026.06 (Typescript, Java)

## [6.2.1 / 2026-04-13]
### Changed
* OpenSource clean up

## [6.2.1 / 2026-04-13]
### Changed
* OpenSource clean up

## [6.2.0 / 2026-01-07]

### Changed

- Cleanup build script and unwanted content

## [6.1.0 / 2025-09-04]

### Bug fixes

- [Dev] Fix Docker production build issues

## [6.0.1 / 2025-08-06]

### Changed

- [BAPExample] Upgrade A12 2025.06

### Bug fixes

- [CodeEditor] Fix missing monaco.d.ts references

## [6.0.0 / 2025-05-14]

### BREAKING CHANGES

- [CodeEditor] Upgrade `monaco-editor` to version `0.50.0` and `@monaco-editor/react` to version `4.7.0`
- [CodeEditor] Upgrade `react` to version 19
- [CodeEditor] Migrate to ESM
- [CodeEditor] Upgrade `typescript` to 5.8.2
- [CodeEditor] Upgrade `antlr4` to version `4.13.2`

## [5.1.0 / 2025-01-15]

### Changed

- [BAPExample] Upgrade A12 2024.06

### Bug fixes

- [CodeEditor] Fix `endOfLinePreference.LF` config has no effect on Windows

## [5.0.0 / 2024-05-10]

### BREAKING CHANGES

- [CodeEditor] Update `typescript` to version `5.3.3`
- [CodeEditor] Update `react` to version 18

### Changed

- [BAPExample] Upgrade A12 2023.06
- [BAPExample] Support focusing on the code editor after validation
- [BuildTool] Support node 18
- [CodeEditor] Allow triggering `onMount` even handler if provided
- [BuildTool] Upgrade `antlr` to version `4.13.1`

### Bug fixes

- [CodeEditor] Fix `CommonErrorStrategy` cannot catch correct exception types.

## [4.0.0 / 2023-07-10]

### BREAKING CHANGES

- [BuildTool] Upgrade `antlr4` to version `4.13.0`. Javascript target is replaced by Typescript target.
- [CodeEditor] `types/antlr4` has been removed. All antlr4 types need to be used from `antlr4` package.
- [CodeEditor] Exported modules are optimized to distinct external and internal modules.
- [CodeEditor] Remove Styled Antlr Code Editor
- [CodeEditor] `IAntlrCodeEditorProps.monacoLoaderPath` is migrated to `IAntlrCodeEditorProps.monacoLoader.path`.
- [CodeEditor] `MonacoGlobalConfiguration` namespace is removed. Please import utils directly from `MonacoGlobalConfiguration.ts`
- [BAPExample] Remove `copy-antlr4-types.js` script

### Added

- [CodeEditor] Add the property `endOfLinePreference` to configure the end of line sequence
- [CodeEditor] Add the property `availableLanguages` to `IAntlrCodeEditorProps.monacoLoader` to support localize monaco-editor texts.

### Changed

- [BAPExample] Upgrade to A12 2023.02-ext1
- [BAPExample] Initialize monaco instance by using monaco-loader to configure "de" language for monaco editor.
- [BAPExample] Add HMR support with `@react/refresh`
- [CodeEditor] Remove the need of the `postinstall` script

## [3.0.0 / 2023-03-29]

### BREAKING CHANGES

- [CodeEditor] Replace `stylus` by `styled-components`. By doing this, all stylus customization styling codes need to be implemented on
  integration sides to adapt to their theme.
- [CodeEditor] Use the new property `onFocus` in `IAntlrCodeEditorProps` to handle styles of the `AntlrCodeEditor` when focusing.
- [CodeEditor] `validationError`, `validationErrorMessage`, `validationWarning` and `validationWarningMessage` in `IAntlrCodeEditorProps` are removed. Please have a look at
  `DefaultCustomFormEngineView.tsx` in `code-editor-in-bap-example` to handle showing errors from `AntlrCodeEditor` properly.
- [CodeEditor] Updated the package name from `@com.mgmtp.a12addons/antlr4-code-editor-addon` to `@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core` and publish artifacts under A12 group

### Changed

- [BAPExample] Upgrade `A12 BAP Client` to version `12.3.0` and all related dependencies to compatible version.
- [Dev] Use yarn workspace

## [2.2.0 / 2022-11-15]

### Changed

- [CodeEditor] Changing the `fetchHelpTextSupport` from language scope to AntlrEditor scope. Now you can configure different `fetchHelpTextSupport` for each CodeEditor.

### Bug fixes

- [CodeEditor] Fix `antlr4` typing missing entry point

## [2.1.0 / 2022-07-12]

### Added

- [CodeEditor] Add `disabledDefaultGrammarValidation` in `ICommonTokensProviderProps` to support disabling default grammar based validation
- [CodeEditor] Update jsdoc of `fetchHelpTextSupport` to indicate that it is registered only once to monaco before the editor is mounted
  and further changes to it are dismissed
- [CodeEditor] Support marking external errors to editor externally by using `markExternalErrorsRef`

### Bug fixes

- [CodeEditor] `onValueSubmit` props sometimes is not triggered

## [2.0.0 / 2022-04-06]

### BREAKING CHANGES

- [BuildTool] Upgrade `antlr4` to version `4.9.3`. By this upgrade, the javascript target is upgraded to ES6.
- [CodeEditor] `DocumentUtils` namespace has been removed. You can use `getAssignedObject` method from `DocumentService`
  in A12 Kernel to retrieve the element value by its path.
- [CodeEditor] `target` of typescript compile options is upgraded to `ES2020`
- [CodeEditor] Add `literalNames`, `symbolicNames`, `ruleNames` as static attributes to `Lexer.d.ts` and `ILexerConstructor`
- [CodeEditor] Re-structure `antlr4` types folder to match with the new structure of `antlr4` version `4.9.3`
- [CodeEditor] Upgrade `monaco-editor` to version `0.33.0` and `@monaco-editor/react` to version `4.4.1`
- [CodeEditor] `onChange` is added to `EditorProps` by upgrading `@monaco-editor/react` to version `4.4.1`.
  Therefore, `onChange` in `IAntlrCodeEditorProps` is renamed to `onValueSubmit`, which is triggered whenever
  the code editor loses focus and the code input changes

### Changed

- [BAPExample] Upgrade `A12 BAP Client` to version `11.0.0` and all related dependencies to compatible version
- [BAPExample] Add `model-generator` folder to generate model validation file when we need to update models version
- [BAPExample] Update `react` and `react-dom` to version `17.0.2`
- [CodeEditor] Update `typescript` to version `4.5.2`
- [CodeEditor] Configure custom language for monaco is now used in `editorBeforeMount` function instead of `componentDidMount`
- [CodeEditor] Use `defaultLanguage` instead of `language`

### Added

- [BuildTool] Use `babel-node` to run `theming.js`.
- [BAPExample] Add `antlr4` resolve path in `webpack.configMonaco.js` and update `README.md` about this.

## [1.5.0 / 2022-02-15]

### Changed

- [CodeEditor] Replace `onDidBlurEditorWidget` with `onDidBlurEditorText` to execute model onChange
  synchronously.

### Added

- [CodeEditor] Add `field__input--readonly` class when code editor is set readonly

## [1.4.0 / 2021-11-16]

### Changed

- [CodeEditor] Exported IAntlrCodeEditorProps interface

### Added

- [CodeEditor] Support register a custom completion provider via new prop `customCompletionProvider`

## [1.3.0 / 2021-08-16]

### BREAKING CHANGES

- [CodeEditor] Remove `@com.mgmtp.a12/widgets` and `@com.mgmtp.a12/plasma-design`
- [CodeEditor] Remove `AntlrCodeEditorControl` component. Therefore, you have to define `label` by yourself and use
  props `initializationErrorMessage`, `validationErrorMessage` and `validationWarningMessage` to handle initializing code
  editor failed and validation errors

### Changed

- [BAPExample] Remove `monaco-editor-core/min` in `CopyPlugin` and added new `rules` in `webpack.configMonaco.js`
- [BAPExample] Update the way used to import `monaco-editor` in `package.json`
- [BAPExample] Remove `monacoLoaderPath` property for the `CodeEditor`
- [BAPExample] Upgrade `A12 BAP Form Engine` to version `31.1.0`. By upgrade to this version, you can remove the functions `getErrors` and `getWarnings`
- [BAPExample] Upgrade `A12 BAP Client` to version `10.0.0` and all related dependencies to compatible version
- [CodeEditor] Update the way used to import `monaco-editor` in `package.json`.
  No need for a script to change the import method in `@monaco-editor/react`.
- [CodeEditor] Update `typescript` to version `4.2.3`

### Added

- [BAPExample] Define `monaco` as a global object in `src/index.tsx`
- [CodeEditor] Added props `initializationErrorMessage`, `validationErrorMessage` and `validationWarningMessage`
- [CodeEditor] Set `fixedOverflowWidgets` default to true to fix partially hidden popup issue
- [CodeEditor] Export `ILexerConstructor` and `IParserConstructor` to support adjust parser and handle multilingual grammars

## [1.2.0 / 2021-04-16]

### Changed

- [CodeEditor] Upgrade runtime dependencies:
    - `@monaco-editor/react`: `3.6.3` --> `3.8.3`
- [CodeEditor] Update api for `AntlrCodeEditor`. Now you don't need to use the `AntlrCodeEditorControl` for control label
  and validation messages.
- [CodeEditor] Upgrade `A12 Widget` and `A12 Plasma design` to version `^31.0.0`
- [BAPExample] Upgrade `A12 BAP Form Engine` to version `31.0.0`. By upgrade to this version, you can remove the copied
  A12 internal utils code in the `DefaultCustomFormEngineView` for the Code editor. We also don't need to use the
  `downlevelIteration` in the `tsconfig.json`
- [BAPExample] Upgrade `A12 Widget` to version `31.0.0`
- [BAPExample] Upgrade `A12 BAP Client` to version `9.0.0`, remove the login page.
- [Dev] Updated example grammar and document model for more custom conditions
  Please have a look at our example code about changes.
- [BAPExample] Use Scss grammar instead of Css3 grammar.

### Added

- [CodeEditor] Added `DocumentUtils` with function `getValue` to get value from A12 document
- [CodeEditor] Support showing externally detected errors
- [CodeEditor] Support asynchronous context assist functionality
- [CodeEditor] Support help text
- [CodeEditor] Added util `getCodeEditorErrors` for getting the Code editor errors
- [CodeEditor] Added `EditorValidationState` for getting the state of validation tasks. You can check if the validation process
  is finished or not.
- [Dev] Throw a warning message if there are any in-progress validation task
- [Dev] Use the new util for checking the Code editor error instead of validate the whole code again.

## [1.1.0 / 2020-12-22]

### Changed

- [CodeEditor] Upgrade runtime dependencies:
    - `@monaco-editor/react`: `3.2.1` --> `3.6.3`
    - `monaco-editor@0.19.3` --> `monaco-editor-core@0.21.2`
- [CodeEditor] Use `@com.mgmtp.a12/widgets` version ^30.0.0 as peer dependency
- [BAPExample] Upgrade A12 BAP Client to version 8.0.0 and its peer dependencies to matched version

## [1.0.0 / 2020-08-25]

### BREAKING CHANGES

- [CodeEditor] Now requires `@com.mgmtp.a12/widgets` version 29.0.0 as peer dependency

### Changed

- [BAPExample] Upgraded BAP Client to version 7.0.0 and its dependencies to required version

## [0.8.0 / 2020-08-07]

### Added

- [BuildTool] New parameter `--init-script`/`-I` to pass the gradle initialization scripts

### Changed

- [BuildTool] CLI now requires global Gradle 3.5 to 6.5 to work normally

## [0.7.0 / 2020-06-08]

### Added

- [BuildTool] Antlr4 Build Tool is now published to the artifactory!
  Antlr4 Build Tool will be versioned the same as Antlr4 Code Editor Addon for compatibility.
- [BuildTool] Antlr4 Build Tool now supports CLI
- [BuildTool] Type-safe for generated Lexer and Parser

### Changed

- [CodeEditor] Support A12 validation messages from addon
- [CodeEditor] Type-safe for lexer and parser property in IAntlrConfig.

The migration steps are described under the
[release page]

## [0.6.0 / 2020-05-13]

### BREAKING CHANGES

- [CodeEditor] We added additional error messages and reworked some old error messages.
  You would need to update your resources file for localization.
- [CodeEditor] The path to monaco-loader is now configurable.
  However, it leads to the problem where monaco will use the Microsoft's CDN as the fallback.
  Therefore, you have to configMonaco the path to monaco-loader in order to avoid accidentally using an external CDN
- [BuildTool] Theming file generated from build-tool now uses the type imported from add-on.

The migration steps are described under the
[release page]

### Added

- [CodeEditor] Expose error handler when monaco editor is not initialized - A12AO-314
- [CodeEditor] Option to use a custom monaco library URL (on the same host or different host)
- [CodeEditor] Option to load monaco-editor library from Microsoft CDN
- [CodeEditor] Expose IStandaloneThemeData and LanguageConfiguration type in addon
- [Dev] The showcase server for Code Editor is running on A12 QA Server
- [Dev] Synchronize Add-on version with Jira version

### Changed

- [BAPExample] Removed `files` in tsconfig.json
- [CodeEditor] Support A12 BAP Form Engine validation for LexerError

## [0.5.0 / 2020-04-22]

### Breaking changes

- [BuildTool] Removed JSON theming file from generated source (replaced by the TS file)

### Added

- [CodeEditor] Support localization for code editor error messages
- [Dev] Use Lerna for building project

### Changed

- [BAPExample] Using CopyWebpackPlugin for copying static resources to dist folder
- [BuildTool] Generate TS file for Monaco theme instead of JSON file
- [BuildTool] Using CSS3 grammar as example grammar
- [Dev] Remove package-lock.json

## [0.4.0 / 2020-04-09]

### Added

- [CodeEditor] Type-safe for antlr4
- [CodeEditor] Support A12 validation for AntlrCodeEditor component

### Changed

- [BAPExample] Upgrade A12 BAP Client to version 2020.02
- [Dev] Update README for clearer instructions for A12 BAP Client integration

### Breaking changes

- [CodeEditor] Removed component DefaultCustomFormEngineView (DefaultCustomFormEngineView is now used as an example code)

## [0.3.0 / 2020-03-24]

### Added

- [BuildTool] Antlr build tool now supports Antlr grammars with BaseLexer and BaseParser
- [BuildTool] Antlr build tool supports Antlr grammars in single grammar file

### Bug fixes

- [CodeEditor] Code Editor throws exceptions and gets broken when encounter tokens without names

## [0.2.0 / 2020-03-11]

### Changed

- [BAPExample] Fetch suggestion list from mock API
- [CodeEditor] Expose suggestions list as a promise-like callback
- [CodeEditor] Enhance error handlers
- [CodeEditor] Force Monaco to use javascript files from project

## [0.1.0 / 2020-02-20]

### Added

- [BuildTool] Converting Antlr4 grammar to Lexer and Parser JS files
- [CodeEditor] Monaco code editor
