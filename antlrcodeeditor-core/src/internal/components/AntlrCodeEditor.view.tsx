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
 * 1. Open-Source License – EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { Editor, EditorProps, Monaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api.js";
import { Component, ReactNode } from "react";

import {
	setErrorMarkersOnExternalErrors,
	setErrorMarkersOnSyntaxErrors,
	setMarkExternalErrorsRef,
	setupEditor
} from "../utils/CodeEditorUtils.js";
import { ContextAssistFunctionalityProvider } from "../utils/ContextAssistFunctionalityProvider.js";
import { defaultCompletionProvider } from "../utils/DefaultCompletionProvider.js";
import { hoverProvider } from "../utils/HoverProvider.js";
import { ICustomLanguageConfiguration } from "../types/MonacoConfig.js";
import { AntlrCodeEditorTemplateResolver } from "../localization/LocalizationUtils.js";
import * as MonacoGlobalConfiguration from "../utils/MonacoGlobalConfiguration.js";
import { CodeCompletionProvider } from "../utils/CodeCompletionProvider.js";

import { IAntlrCodeEditorProps } from "./AntlrCodeEditor.api.js";

import IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;
import IDisposable = monaco.IDisposable;

interface IAntlrCodeEditorState {
	oldValue?: string;
	initializationError?: Error;
}

const DELAY_TIME_FETCHING_EXTERNAL_ERRORS = 1000;

/**
 * The basic Code Editor component
 */
export class AntlrCodeEditor extends Component<
	IAntlrCodeEditorProps & ICustomLanguageConfiguration & EditorProps,
	IAntlrCodeEditorState
> {
	/**
	 * This attribute is used to store the reference of `completionProvider` and `hoverProvider`.
	 * We must dispose these provider when the component is unmounted.
	 * Otherwise, the completion list and help text for token could be duplicated the second time the code editor is mounted.
	 */
	private disposables: IDisposable[] = [];

	private DEFAULT_INITIALIZATION_ERROR_MSG = AntlrCodeEditorTemplateResolver.resolve(
		"antlrCodeEditor.error.initializationFailed"
	);

	/**
	 * This attribute is used to store all timerIds to support throttling when fetching external errors.
	 * All timer ids would be cleared when the component is unmounted.
	 */
	private timerIds: Map<string, number | undefined> | undefined;

	public static defaultProps = {
		delayFetchExternalErrors: DELAY_TIME_FETCHING_EXTERNAL_ERRORS
	};

	constructor(props: IAntlrCodeEditorProps & ICustomLanguageConfiguration & EditorProps) {
		super(props);
		if (props.fetchExternalErrors) {
			this.timerIds = new Map();
		}
		this.state = {};
	}

	async componentDidMount(): Promise<void> {
		try {
			/**
			 * Only initialize monaco if not exists.
			 */
			if (!window.monaco) {
				await MonacoGlobalConfiguration.initMonaco(this.props.monacoLoader);
			}
		} catch (exception) {
			const initializationError =
				exception instanceof Error ? exception : new Error(this.DEFAULT_INITIALIZATION_ERROR_MSG);
			this.props.onEditorInitFailed?.(initializationError);
			this.setState({ initializationError });
		}
	}

	editorBeforeMount = (): void => {
		MonacoGlobalConfiguration.configureCustomLanguage(this.props);
	};

	componentDidUpdate(prevProps: Readonly<IAntlrCodeEditorProps & ICustomLanguageConfiguration & EditorProps>): void {
		if (prevProps.value !== this.props.value) {
			this.setState({
				oldValue: this.props.value
			});
		}
	}

	editorOnMount = async (editor: IStandaloneCodeEditor, monaco: Monaco): Promise<void> => {
		const editorModel = editor.getModel();
		const {
			tokensProvider,
			getSuggestions,
			fetchExternalErrors,
			delayFetchExternalErrors,
			fetchContextAssistFunctionality,
			fetchHelpTextSupport,
			codeCompletionShortcut,
			customCompletionProvider,
			markExternalErrorsRef,
			onFocus,
			endOfLinePreference
		} = this.props;
		if (fetchExternalErrors) {
			setupEditor(editor, tokensProvider, onFocus, this.timerIds, fetchExternalErrors, delayFetchExternalErrors);
			// force Monaco editor to validate external error right after mounting
			await setErrorMarkersOnExternalErrors(editor, fetchExternalErrors);
			if (markExternalErrorsRef) {
				setMarkExternalErrorsRef(
					editor,
					markExternalErrorsRef,
					fetchExternalErrors,
					this.timerIds!,
					delayFetchExternalErrors
				);
			}
		} else {
			setupEditor(editor, tokensProvider, onFocus);
		}

		// force Monaco editor to check syntax error right after mounting
		setErrorMarkersOnSyntaxErrors(editor, tokensProvider);

		editor.onDidBlurEditorText(() => {
			const newValue = editor.getValue();
			if (newValue !== this.state.oldValue) {
				this.props.onValueSubmit?.(newValue);
			}
		});

		/*
		Add keyboard shortcut to trigger suggestions
		Default:
			- MacOS: Ctrl + Space, Alt + Escape
			- Windows: Ctrl + Space
		*/
		if (codeCompletionShortcut) {
			editor.addCommand(codeCompletionShortcut(), () => {
				editor.trigger("AntlrCodeEditor", "editor.action.triggerSuggest", {});
			});
		}

		if (!editorModel) {
			return;
		}

		if (typeof endOfLinePreference !== "undefined") {
			editorModel.setEOL(endOfLinePreference);
		}

		if (customCompletionProvider) {
			this.disposables.push(
				monaco.languages.registerCompletionItemProvider(
					tokensProvider.getLanguageName(),
					customCompletionProvider(editorModel)
				)
			);
		} else {
			this.disposables.push(
				monaco.languages.registerCompletionItemProvider(
					tokensProvider.getLanguageName(),
					defaultCompletionProvider(editorModel, tokensProvider)
				)
			);
		}

		if (getSuggestions) {
			getSuggestions().then(suggestions => {
				this.disposables.push(
					monaco.languages.registerCompletionItemProvider(
						tokensProvider.getLanguageName(),
						new CodeCompletionProvider(editorModel.id, suggestions)
					)
				);
			});
		}

		if (fetchContextAssistFunctionality) {
			this.disposables.push(
				monaco.languages.registerCompletionItemProvider(
					tokensProvider.getLanguageName(),
					new ContextAssistFunctionalityProvider(
						editorModel.id,
						tokensProvider,
						fetchContextAssistFunctionality
					)
				)
			);
		}

		if (fetchHelpTextSupport) {
			this.disposables.push(
				monaco.languages.registerHoverProvider(
					tokensProvider.getLanguageName(),
					hoverProvider(editorModel.id, fetchHelpTextSupport, tokensProvider)
				)
			);
		}
		this.props.onMount?.(editor, monaco);
	};

	componentWillUnmount = (): void => {
		this.disposables.forEach(disposable => disposable?.dispose());
		this.timerIds?.clear();
	};

	render = (): ReactNode => {
		const { tokensProvider, customTheme, uiConfig, initializationErrorMessage } = this.props;
		const { initializationError } = this.state;

		if (!initializationError) {
			return (
				<Editor
					theme={customTheme ? "customTheme" : "light"}
					{...this.props} // Allow user to use built-in Monaco themes via theme property
					options={{
						minimap: {
							enabled: false
						},
						fixedOverflowWidgets: true,
						...uiConfig?.options
					}}
					height={uiConfig?.height || "144px"}
					width={uiConfig?.width}
					defaultLanguage={tokensProvider.getLanguageName()}
					onMount={this.editorOnMount}
					beforeMount={this.editorBeforeMount}
				/>
			);
		}

		return initializationErrorMessage ? initializationErrorMessage : this.DEFAULT_INITIALIZATION_ERROR_MSG;
	};
}
