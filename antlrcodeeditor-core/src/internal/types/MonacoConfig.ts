/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 * You may redistribute and/or modify this file under the terms of the
 * European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 * Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 * under different terms (including support and maintenance services).
 *
 * Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { CharStream, CommonTokenStream, Lexer, Parser } from "antlr4";

import type { IStandaloneThemeData } from "../../index.js";

import type { AntlrCodeEditorResourceBundle } from "../localization/ResourceBundle.js";
import { CommonTokensProvider } from "../utils/CommonTokensProvider.js";

type LanguageConfiguration = monaco.languages.LanguageConfiguration;
type IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;

export interface ILexerConstructor {
	literalNames: (string | null)[];
	symbolicNames: (string | null)[];
	ruleNames: string[];

	new (chars: CharStream): Lexer;
}

export interface IParserConstructor {
	ruleNames: string[];

	new (chars: CommonTokenStream): Parser;
}

/**
 * The return type for custom suggestions callback
 */
export interface ISuggestion {
	text: string;
}

/**
 * Used in `IAntlrDictionary`
 *
 * @see IAntlrDictionary
 */
export interface IAntlrVocabulary {
	/**
	 * Token's literalName
	 */
	text: string;

	/**
	 * Token's symbolicName
	 */
	token: string;

	/**
	 * The number indicates the ordinal of the token. This is unique.
	 */
	tokenType: number;
}

/**
 * Used as the lookup dictionary
 */
export type IAntlrDictionary = IAntlrVocabulary[];

/**
 * Configurations for Antlr4 Code Editor
 */
export interface IAntlrConfig {
	/**
	 * Generated Lexer
	 */
	lexer: ILexerConstructor;

	/**
	 * Generated Parser
	 */
	parser: IParserConstructor;

	/**
	 * Top-level validation rule in the Parser grammar file.
	 * This is the rule against which the whole code input in the editor will be validated.
	 */
	rootRuleName: string;

	/**
	 * Generated theming file.
	 * If left empty, default "light" theme is applied to the code editor
	 */
	theme?: IStandaloneThemeData;

	/**
	 * Callback for getting the custom suggestions
	 *
	 * @return `Promise<ISuggestion[]>`
	 */
	getSuggestions?(): Promise<ISuggestion[]>;

	/**
	 * UI configuration for monaco-editor
	 */
	uiConfig?: IMonacoEditorUIConfig;
}

/**
 * UI configuration for monaco-editor
 */
export interface IMonacoEditorUIConfig {
	/**
	 * Width of the code editor
	 */
	width?: number | string;

	/**
	 * Height of the code editor
	 */
	height?: number | string;

	/**
	 * UI options for monaco-editor
	 * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
	 */
	options?: IEditorConstructionOptions;
}

/**
 * Antlr Code Editor's property
 */
export interface IAntlrProps {
	antlrConfig: IAntlrConfig;
}

/**
 * Props type of the `CommonTokensProvider`
 */
export interface ICommonTokensProviderProps {
	/**
	 * Generated lexer from build-tool
	 */
	lexer: ILexerConstructor;

	/**
	 * Generated parser from build-tool
	 */
	parser: IParserConstructor;

	/**
	 * Language name. This value must match the `CodeEditor` property configured in Data Modeler.
	 */
	language: string;

	/**
	 * The top-level parser rule name,
	 * which will be called by the `CommonTokensProvider` to validate the whole code block against.
	 */
	rootRuleName: string;

	errorTemplates?: AntlrCodeEditorResourceBundle;

	/**
	 * Set this to true if you want to disable default grammar based validation.
	 */
	disabledDefaultGrammarValidation?: boolean;
}

/**
 * Used to configure custom languages
 */
export interface ICustomLanguageConfiguration {
	/**
	 * Custom token provider. Can be constructed from generated Lexer and Parser.
	 */
	tokensProvider: CommonTokensProvider;

	/**
	 * Callback for custom suggestions. Here you can call API to get an array of `ISuggestion`.
	 */
	getSuggestions?(): Promise<ISuggestion[]>;

	/**
	 * Some editor's customization for the custom programming languages.
	 * There are two capturing groups in a word pattern:
	 * - 1st: Define the main token pattern (digit and word character) in a word.
	 * - 2nd: Define the separator pattern in a word. Ex: +, -, :, ;, etc.
	 *
	 * DEFAULT:
	 * - wordPattern: </(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g>
	 * - All other values are undefined.
	 *
	 * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.languageconfiguration.html
	 */
	languageConfiguration?: LanguageConfiguration;

	/**
	 * Theme definition for the custom language. You can pass the generated theme file directly here.
	 */
	customTheme?: IStandaloneThemeData;
}
