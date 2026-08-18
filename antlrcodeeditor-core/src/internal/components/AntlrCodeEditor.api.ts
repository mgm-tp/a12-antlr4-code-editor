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
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
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

import { MutableRefObject, ReactNode } from "react";

import { IMonacoEditorUIConfig } from "../types/MonacoConfig.js";
import { ValidationError } from "../errors/ValidationError.js";
import { IAsyncSuggestion, ITokenForAsyncContextAssist } from "../types/AsyncContextAssist.js";

import EndOfLineSequence = monaco.editor.EndOfLineSequence;
import ITextModel = monaco.editor.ITextModel;
import CompletionItemProvider = monaco.languages.CompletionItemProvider;

export interface IMonacoLoaderProps {
	/**
	 * The path to monaco-editor's `loader` on server.
	 * Essential to the initialization phase of monaco-editor when you are not defining monaco as a global object
	 * which are initialized when your website starts running.
	 *
	 * **Important:** If you don't provide this property a value,
	 * monaco-editor will retrieve its loader file from Microsoft's CDN.
	 * It could be a security risk!
	 */
	path?: string;

	/**
	 * Under the hood, all monaco-editor texts could be localized.
	 * This property can be used to define which language that a monaco-editor text is displaying.
	 *
	 * @example: "*": "de" - All monaco-editor text would be displayed in DE.
	 */
	availableLanguages?: object;
}

/**
 * Properties for AntlrCodeEditor
 */
export interface IAntlrCodeEditorProps {
	/**
	 * UI configuration for monaco editor
	 */
	uiConfig?: IMonacoEditorUIConfig;

	/**
	 * Monaco loader properties.
	 *
	 * @Note These props would be ignored if a monaco instance already exists.
	 */
	monacoLoader?: IMonacoLoaderProps;

	/**
	 * Time(ms) between two fetching external errors requests
	 */
	delayFetchExternalErrors?: number;

	/**
	 * Keyboard shortcut to force editor to display suggestions for code completion.
	 *
	 * Default:
			- MacOS: Ctrl + Space, Alt + Escape
			- Windows: Ctrl + Space
	 */
	codeCompletionShortcut?: () => number;

	/**
	 * End of line character preference
	 */
	endOfLinePreference?: EndOfLineSequence;

	/**
	 * Triggered whenever the code editor loses focus and the code input changes
	 *
	 * @param changedValue - The code input after changed
	 */
	onValueSubmit?(changedValue: string): void;

	/**
	 * Triggered when the monaco-editor fails to initialize
	 *
	 * @param error - Error object to be thrown
	 */
	onEditorInitFailed?(error: Error): void;

	/**
	 * Function for fetching external errors
	 *
	 * @param input - The code for verifying external errors
	 */
	fetchExternalErrors?(input: string): Promise<ValidationError[]>;

	/**
	 * Function for fetching context assist functionality
	 *
	 * @param currentTokenStream - List all tokens in the editor
	 * @param cursorPosition - Current position of the cursor
	 */
	fetchContextAssistFunctionality?(
		currentTokenStream: ITokenForAsyncContextAssist[],
		cursorPosition: monaco.Position
	): Promise<IAsyncSuggestion[]>;

	/**
	 * Callback for fetching help text support.
	 *
	 * @param currentTokenStream - List all tokens in the editor
	 * @param cursorPosition - Current position of the cursor hovering
	 */
	fetchHelpTextSupport?(
		currentTokenStream: ITokenForAsyncContextAssist[],
		cursorPosition: monaco.Position
	): Promise<monaco.IMarkdownString[]>;

	/**
	 * The factory method to get the Completion provider.
	 *
	 * You can limit the execution of your completion provider for a specific code editor (in case you have more than one editor)
	 * by comparing the editorModel id with the model param from completion provider. For example:
	 * ```
	 * if (model.id === editorModel.id) {
	 * ...
	 * }
	 * ```
	 *
	 * @param editorModel the current editor model
	 */
	customCompletionProvider?(editorModel: ITextModel): CompletionItemProvider;

	/**
	 * Initialization message that appears when initializing code editor failed.
	 */
	initializationErrorMessage?: ReactNode;

	/**
	 * Ref to mark external errors to the editor externally.
	 *
	 * NOTE: You need to define fetchExternalErrors.
	 */
	markExternalErrorsRef?: MutableRefObject<(() => void) | null>;

	/**
	 * Callback which is triggered when focusing the code editor component.
	 */
	onFocus?: (isFocused: boolean) => void;
}
