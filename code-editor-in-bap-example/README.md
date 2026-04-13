# Antlr Code Editor in A12 Client Application
Example A12 Client Application that serves as the showcase for the Antlr Code Editor.

## Resources
* `./resources/html/models`: Sample A12 Form Engine models
* `./src/config/grammar`: Code editor grammar files (Lexer, Parser) and CustomTheme configurations which are generated from `antlrcodeeditor-build-tool`

## Configurations
### _webpack.config.js_
#### Config Monaco-Editor Library
By default, `monaco-editor/react` loads the library source from a CDN, which is not the preferred approach in some projects. 
If you want to load these library files from the project server,
you can copy the `monaco` source code to your own server and config the prop `monacoLoaderPath` to point there.
If you want to load `monaco` from `node_modules` with webpack support, 
you can use `style-loader` and `css-loader` to add new rules and remove the prop `monacoLoaderPath`.

In this example, we are using `monaco` from `node_modules` and using `style-loader`, `css-loader` along with Webpack.
Reference to [code-editor-in-bap-example/webpack.config.js](./webpack.config.js) about new setup.

### Customize Error Messages via Templates
* To customize error messages prompted by Antlr Code Editor Addon via templates,
  simply pass an `AntlrCodeEditorLocalizedResourceBundle` object to property `errorTemplates` when constructing the `CommonTokensProvider`.

**Example**:
* In [resource.ts](./src/config/resources.ts), create an `antlrCodeEditorCustomErrorTemplates`
```
export const antlrCodeEditorCustomErrorTemplates: IAntlrCodeEditorLocalizedResourceBundle = {
    en: {
        "antlrCodeEditor.error.unwantedToken": "Bad input {actualTokenName}, expecting {expectedTokenName}",
        "antlrCodeEditor.error.noViableAlternative": "No possible replacement at {input}"
    },
    de: {
        "antlrCodeEditor.error.unwantedToken": "Falsche Eingabe {actualTokenName}, erwarte {expectedTokenName}",
        "antlrCodeEditor.error.noViableAlternative": "Zu {input} gibt es keine sinnvolle Alternative"
    }
};
```
* In [CodeEditorControl.tsx](./src/modules/defaultCustomFormEngineView/CodeEditorControl.tsx),
  find `language` by using `UiStateSelectors` and pass it to `antlrCodeEditorCustomErrorTemplates`:
```
const locale = UiStateSelectors.locale()(renderOptions.state);
const { language } = locale;
const tokensProvider = new CommonTokensProvider({
    // other properties...
    errorTemplates: antlrCodeEditorCustomErrorTemplates[language]
});

...

<AntlrCodeEditor
    tokensProvider={tokensProvider}
    // other configs...
/>
```

**Note**: All templates have their default values.

## Custom FormEngineView
For rendering the custom component to A12 Form Engine, you have to create a custom FormEngineView.

For reference of example custom `FormEngineView`, you can take a look at module 
[DefaultCustomFormEngineView.tsx](./src/modules/defaultCustomFormEngineView/DefaultCustomFormEngineView.tsx)

### Document Model configuration
To be able to recognize which component is the `CodeEditor` component when rendering Form Engine's components, 
we use the field annotation in Form Model.

In Simple Model Editor, you can create a new annotation named `CodeEditor` with its value is the language name e.g. `example`. 
The generated JSON of the screen element would look like following snippet:
```json
{
	"type": "Control",
	"id": "control-ceeeb",
	"annotations": [
		{
			"name": "CodeEditor",
			"value": "example"
		}
	],
	"offset": {
		"lg": 0
	},
	"label": {
		"type": "Multilingual",
		"multilingualText": {
			"text": [
				{
					"locale": "en",
					"text": "Code editor"
				},
				{
					"locale": "de",
					"text": "Code-Editor"
				}
			]
		}
	},
	"elementRef": "field_f3103"
}
```
Config the custom form Engine view in [appmodel.json](./src/appmodel.json)
```
"sceneChange": {
  "onEnter": [
    {
      "type": "VIEW_ADD",
      "container": "CustomFormEngine",
      "models": [
        {
          "modelType": "form",
          "name": "sample.melies"
        }
      ]
    }
  ]
}
```

### Code Editor Validation
#### Document Model config
In order to support validation from A12 Client, you have to create a custom rule in the Code Editor field in the Simple Model Editor.
Error condition would be like this:
```
FieldFilled(CodeEditor) and  CustomCondition CodeEditorCondition
```

#### Register Custom Condition in A12 Client
Create a new custom condition in A12 Client via [appsetup.ts](./src/appsetup.ts)

```
const tokenProvider = new CommonTokensProvider({
    lexerType: Css3Lexer,
    parserType: Css3Parser,
    rootRuleName: "stylesheet",
    language: "example"
});

// Custom conditions map which used for code editor
const conditionsMap: Record<string, ICustomCondition> = {
	CodeEditorCondition: {
		check(
			data: IData,
			relevantEntities: Set<IIdentifier> | undefined,
			formallyIncorrectFields: Set<IIdentifier>,
			errorField: IIdentifier
		) {
			const fieldContent = data.getValue(errorField);
			if (fieldContent) {
				const errors = getCodeEditorErrors("example");
				return errors.length > 0;
			}

			return false;
		}
	},
}
```
Register this custom condition map to A12 Kernel by using `RtCustomExtensionService.registerCustomConditions`
```
RtCustomExtensionService.registerCustomConditions({
	createCustomCondition(name: string) {
		return conditionsMap[name];
	}
});
```

#### Config Error When Initializing Code Editor Failed
By default, when initializing code editor failed, the `AntlrCodeEditor` component will return a string to announce the
initialization error. You can customize this behavior by using props `initializationErrorMessage` of 
the `AntlrCodeEditor` component like this:
```
<AntlrCodeEditor
	...
	initializationErrorMessage={
		<InputElements.Warning
			className={"field__message"}
			warningMessage={localizer("antlrCodeEditor.error.initializationFailed")}
		/>
	}
	...
/>
```

#### Config Validation in Custom FormEngineView
We provide props `validationErrorElement` and `validationWarningElement` to show validation messages
together with the `AntlrCodeEditor`.

**Retrieve validation messages from redux store**

The A12 Validation engine is triggered automatically after updating the code editor value.
If there are any validation errors, Validation engine adds messages to the store.
In order to get these messages, we can use utils from A12.
```
    const errorMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"error"
	)(renderOptions.state);
	const warningMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"warning"
	)(renderOptions.state);
	const errorMessages = errorMessagesForElement.map(m => m.errorText || m.errorKey);
	const warningMessages = warningMessagesForElement.map(m => m.errorText || m.errorKey);
```

**Show validation messages on wrapper component**
```
const renderErrorContent = (messages: string[]): ReactNode => {
	if (messages.length > 1) {
		return (
			<ul>
				{messages.map((error, index) => (
					<li key={index}>{error}</li>
				))}
			</ul>
		);
	}
	return <div>{messages}</div>;
};

<AntlrCodeEditor
	...
	validationError={errorMessages.length > 0}
	validationWarning={warningMessages.length > 0}
	validationErrorMessage={
		<InputElements.Error
			className={"field__message"}
			errorMessage={renderErrorContent(errorMessages)}
		/>
	}
	validationWarningMessage={
		<InputElements.Warning
			className={"field__message"}
			warningMessage={renderErrorContent(warningMessages)}
		/>
	}
	...
/>
```

#### Monaco-Editor Language Configuration
In [CodeEditorControl.tsx](src/modules/defaultCustomFormEngineView/CodeEditorControl.tsx),
you can find a sample language configuration:
```
import { LanguageConfiguration } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";

const configuration: LanguageConfiguration = {
    brackets: [
        ["{", "}"], ["[", "]"], ["(", ")"], ["\"", "\""], ["'", "'"]
    ],
    wordPattern: /(-?\d*\.\d\w*)|([^\[{\]}:",\s]+)/g
};
```
where
* `brackets`: when you type an opening bracket, the corresponding closing bracket will be automatically added
* `wordPattern`: the regex that monaco-editor uses to recognize a word, will be used in suggestion process
* For more configurations related to the behavior of the code editor,
you can take a look at [this link](https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.LanguageConfiguration.html).

**Note:** It is important to set the `wordPattern` property in case your grammar has keywords that start with special
characters, such as `@media` in case of our demo grammar `Css3`. Otherwise, by default, `monaco-editor` will ignore every
special character. Therefore, your keywords won't trigger suggestion nor appear in the suggestions list.

### ContainerFactory
To be able to render the custom Widget to FormEngine, we will create a custom view component provider.
You can find the example code under [containerFactory.tsx](./src/app/containerFactory.tsx).
```
import { DefaultCustomFormEngineView } from "./modules/defaultCustomFormEngineView/DefaultCustomFormEngineView";
import { IAntlrConfig, ISuggestion } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core/lib";
import { Css3Lexer, Css3Parser, theme } from "./config/grammar";

const getSuggestions = (): Promise<ISuggestion[]> => fetch("./suggestions.json").then(response => response.json());

CustomFormEngine(props) {
    const configObject: IAntlrConfig = {
        lexer: Css3Lexer,
        parser: Css3Parser,
        theme,
        getSuggestions,
        rootRuleName: "stylesheet",
        uiConfig: {
            height: "196px"
        }
    };

    return <DefaultCustomFormEngineView {...props} antlrConfig={configObject}/>;
}
```

### AntlrCodeEditor Configurations
Some important configurations:
* monacoLoader? (`IMonacoLoaderProps`): Used to config monaco loader properties. 
If not defined, the monaco instance would be loaded from CDN (default monaco loader properties).
If `window.monaco` exist, the addon skip fetching the monaco source.
  * path? (`string`): The path to monaco loader. It could be a relative path, or an absolute path to your own CDN. 
  * availableLanguages? (`object`): Used to define which language that a monaco editor text is displaying

* onEditorInitFailed? (`(error: Error) => void`): Callback to be called when monaco loader initialization failed.
Can be used for print logs, render fallback components, etc.

* lexer: Generated Lexer file from `antlrcodeeditor-build-tool`
* parser: Generated Parser file from `antlrcodeeditor-build-tool`
* rootRuleName: The top-level rule of Parser, against which the Code Editor will use to validate.
* theme?: The styling for syntax highlighting in Code Editor. `antlrcodeeditor-build-tool` will generate the default theme based on your Antlr grammar.
Some editor coloring can also be configured here.

* getSuggestions?: A callback that returns a `Promise<ISuggestion[]>`. You can get the data from your field API or from Models.
* uiConfig?: Used to modify some UI appearance of the Code Editor.
  * width? (`number | string`): Width of the Code Editor in context of its container
  * height? (`number | string`): Height of the Code Editor in context of its container
  * options? (`IEditorConstructionOptions`): Some UI options of the Code Editor.
  For more options, checkout [this page](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorConstructionOptions.html).

You can refer to the Antlr Code Editor Core interfaces for all available configurations. 

### AntlrCodeEditor Styling
#### Custom Theme for Tokens and Editor
Open `src/config/grammar/{languageName}.theme.ts`, this file contains all customizable styling for your grammar's tokens.
You can specify your own colors style for them.
