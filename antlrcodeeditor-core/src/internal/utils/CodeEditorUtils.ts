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

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api.js";
import type { MutableRefObject } from "react";

import { ValidationStatus, ValidationType } from "../types/ValidationState.js";
import { ValidationError } from "../errors/ValidationError.js";

import { CommonTokensProvider } from "./CommonTokensProvider.js";
import { setValidationState } from "./EditorValidationState.js";

type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;
type IMarkerData = monaco.editor.IMarkerData;
type IMarker = monaco.editor.IMarker;

/**
 * Function for validating the code and marking the errors in the code editor if any. The validation use the Antlr grammar
 * to validate the code.
 *
 * @param editor
 * @param tokensProvider
 */
export const setErrorMarkersOnSyntaxErrors = (
	editor: IStandaloneCodeEditor,
	tokensProvider: CommonTokensProvider
): void => {
	const editorModel = editor.getModel();
	if (editorModel) {
		setValidationState({
			validationType: ValidationType.GRAMMAR,
			owner: editorModel.getLanguageId(),
			status: ValidationStatus.CHECKING
		});
		const syntaxErrors: ValidationError[] = tokensProvider.validate(editor.getValue());
		const monacoSyntaxMarkers: IMarkerData[] = mapValidationErrorsToMonacoMarkers(syntaxErrors);
		monaco.editor.setModelMarkers(
			editorModel,
			`${editorModel.getLanguageId()}/${ValidationType.GRAMMAR}`,
			monacoSyntaxMarkers
		);
		setValidationState({
			validationType: ValidationType.GRAMMAR,
			owner: editorModel.getLanguageId(),
			status: ValidationStatus.DONE
		});
	}
};

/**
 * Function for marking external errors to the monaco editor
 *
 * @param editor - Monaco editor instance
 * @param fetchExternalErrors - Function for fetching external errors
 */
export const setErrorMarkersOnExternalErrors = async (
	editor: IStandaloneCodeEditor,
	fetchExternalErrors: (input: string) => Promise<ValidationError[]>
): Promise<void> => {
	const editorModel = editor.getModel();
	if (editorModel) {
		const currentValue = editor.getValue();
		const monacoSyntaxMarkers: IMarkerData[] = mapValidationErrorsToMonacoMarkers(
			await fetchExternalErrors(editor.getValue())
		);
		if (editor.getValue() === currentValue) {
			monaco.editor.setModelMarkers(
				editorModel,
				`${editorModel.getLanguageId()}/${ValidationType.EXTERNAL}`,
				monacoSyntaxMarkers
			);
			setValidationState({
				validationType: ValidationType.EXTERNAL,
				owner: editorModel.getLanguageId(),
				status: ValidationStatus.DONE
			});
		}
	}
};

export const setupFocusAndBlurListenerForEditor = (
	editor: IStandaloneCodeEditor,
	onFocus?: (isFocused: boolean) => void,
	timerIds?: Map<string, number | undefined>
): void => {
	editor.onDidFocusEditorWidget(() => {
		onFocus?.(true);
	});
	editor.onDidBlurEditorWidget(() => {
		onFocus?.(false);
	});
};

/**
 * Throttle the external validation request to reduce the server load.
 *
 * @param callback the function to be executed after the timeout reaching
 * @param delay the time span between requests
 * @param modelId the id of the current editor
 * @param timerIds the map of timer ids which is used to store all timer id
 */
const throttle = (
	callback: () => Promise<void>,
	delay: number,
	modelId: string,
	timerIds: Map<string, number | undefined>
): void => {
	if (timerIds.get(modelId)) {
		return;
	}
	setValidationState({
		validationType: ValidationType.EXTERNAL,
		owner: modelId,
		status: ValidationStatus.CHECKING
	});
	timerIds.set(
		modelId,
		window.setTimeout(() => {
			callback();
			timerIds.set(modelId, undefined);
		}, delay)
	);
};

const setupSyntaxErrorWatcher = (
	editor: IStandaloneCodeEditor,
	tokensProvider: CommonTokensProvider,
	fetchExternalErrors?: (input: string) => Promise<ValidationError[]>,
	delayFetchExternalErrors?: number,
	timerIds?: Map<string, number | undefined>
): void => {
	editor.onDidChangeModelContent(() => {
		const editorModel = editor.getModel();
		if (editorModel) {
			setErrorMarkersOnSyntaxErrors(editor, tokensProvider);
			if (fetchExternalErrors && delayFetchExternalErrors && timerIds) {
				throttle(
					() => setErrorMarkersOnExternalErrors(editor, fetchExternalErrors),
					delayFetchExternalErrors,
					editorModel.getLanguageId(),
					timerIds
				);
			}
		}
	});
};

export const setMarkExternalErrorsRef = (
	editor: IStandaloneCodeEditor,
	markExternalErrorsRef: MutableRefObject<(() => void) | null>,
	fetchExternalErrors: (input: string) => Promise<ValidationError[]>,
	timerIds: Map<string, number | undefined>,
	delayFetchExternalErrors?: number
): void => {
	const editorModel = editor.getModel();
	if (editorModel && delayFetchExternalErrors) {
		markExternalErrorsRef.current = () =>
			throttle(
				() => setErrorMarkersOnExternalErrors(editor, fetchExternalErrors),
				delayFetchExternalErrors,
				editorModel.getLanguageId(),
				timerIds
			);
	}
};

export const setupEditor = (
	editor: IStandaloneCodeEditor,
	tokensProvider: CommonTokensProvider,
	onFocus?: (isFocused: boolean) => void,
	timerIds?: Map<string, number | undefined>,
	fetchExternalErrors?: (input: string) => Promise<ValidationError[]>,
	delayFetchExternalErrors?: number
): void => {
	setupSyntaxErrorWatcher(editor, tokensProvider, fetchExternalErrors, delayFetchExternalErrors, timerIds);
	setupFocusAndBlurListenerForEditor(editor, onFocus);
};

const mapValidationErrorsToMonacoMarkers = (errors: ValidationError[]): IMarkerData[] => {
	return errors.map(({ startLine, endLine, startCol, endCol, message }) => ({
		startLineNumber: startLine,
		endLineNumber: endLine,
		startColumn: startCol,
		endColumn: endCol,
		message,
		severity: monaco.MarkerSeverity.Error
	}));
};

const mapMarkerToMarkerData = (markers: IMarker[]): IMarkerData[] => {
	return markers.map(marker => ({
		...marker
	}));
};

/**
 * Allow user to get current errors of code editor
 *
 * @param owner - the code editor id
 */
export const getCodeEditorErrors = (owner?: string): IMarkerData[] => {
	if (owner) {
		const grammarErrors = monaco.editor.getModelMarkers({ owner: `${owner}/${ValidationType.GRAMMAR}` });
		const externalErrors = monaco.editor.getModelMarkers({ owner: `${owner}/${ValidationType.EXTERNAL}` });
		return mapMarkerToMarkerData([...grammarErrors, ...externalErrors]);
	}

	return mapMarkerToMarkerData(monaco.editor.getModelMarkers({}));
};

export const getSuggestionRange = (model: monaco.editor.ITextModel, position: monaco.Position): monaco.IRange => {
	const word = model.getWordUntilPosition(position);
	return {
		startLineNumber: position.lineNumber,
		endLineNumber: position.lineNumber,
		startColumn: word.startColumn,
		endColumn: word.endColumn
	};
};
