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

import { type JSX, type ReactNode, useContext, useRef, useState } from "react";
import { useTheme } from "styled-components";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";

import {
	AntlrCodeEditor,
	CommonTokensProvider,
	type IAntlrConfig,
	type IStandaloneThemeData,
	type LanguageConfiguration
} from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";
import { DataSelectors, FormModelPath, UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import { DocumentServiceFactory, type GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import {
	addPrefix,
	InputElements,
	ProgressIndicator,
	StyledBaseInput,
	type TextAreaStatelessProps
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ExternalErrorsService } from "../../mock/ExternalErrors.js";
import { applyDefaultTranslations } from "../../localization/index.js";
import { fetchContextAssistFunctionality } from "../../mock/ContextAssistFunctionality.js";
import { fetchHelpTextSupport } from "../../mock/HelpTextSupport.js";
import { antlrCodeEditorCustomErrorTemplates } from "../../config/index.js";

import { useFormModelMapContext } from "./FormControlContext.js";
import { type ExtendedConfig } from "./DefaultCustomFormEngineView.js";

import EndOfLineSequence = editor.EndOfLineSequence;

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const CodeEditorControl = (props: TextAreaStatelessProps): JSX.Element => {
	const {
		modelElement,
		config: { renderOptions, parentPath }
	} = useFormModelMapContext();
	const editorRef = useRef<IStandaloneCodeEditor | null>(null);

	const languageName = modelElement.annotations?.[0].value || "";
	const customConfig = renderOptions.config as ExtendedConfig;
	const antlrConfig: IAntlrConfig = customConfig.antlrConfig;
	const { lexer, parser, rootRuleName, uiConfig, getSuggestions, theme: editorTheme } = antlrConfig;
	const locale = UiStateSelectors.locale()(renderOptions.state);
	const { language } = locale;
	const theme = useTheme();

	const customEditorTheme: IStandaloneThemeData | undefined = editorTheme
		? {
				...editorTheme,
				colors: {
					...editorTheme.colors,
					"editor.background": theme.components.commonInputStyles.background
				}
			}
		: undefined;

	const tokensProvider = new CommonTokensProvider({
		lexer,
		parser,
		language: languageName,
		rootRuleName: rootRuleName,
		errorTemplates: antlrCodeEditorCustomErrorTemplates[language]
	});

	// Custom configuration specific for CSS3 grammar with Brackets and wordPattern
	const configuration: LanguageConfiguration = {
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
			['"', '"'],
			["'", "'"]
		],
		wordPattern: /(-?\d*\.\d\w*)|([^\[({\])}:",;\s]+)/g
	};

	const documentPath = modelElement.elementPath.map(item => ({
		elementName: item.elementName,
		index: 1
	}));

	// Document
	const value = new DocumentServiceFactory()
		.getDocumentService()
		.getAssignedObject(DataSelectors.document()(renderOptions.state) as GroupInstance, documentPath);

	const onValueSubmit = (changedValue: string): void => {
		renderOptions.eventHandlers.onValueChange(documentPath, changedValue, modelElement.elementPath);
	};

	// Get localized label
	const formModelPath = FormModelPath.extend(parentPath, modelElement);
	const labelLocalizables = UiStateSelectors.InputLocalization.labelLocalizables(
		formModelPath,
		modelElement
	)(renderOptions.state);

	const localizer = useContext(LocalizerContext).localizer;

	const localizedLabel = localizer(...labelLocalizables);

	// Validation error
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
	const errorLocalizableMessages = errorMessagesForElement.map(m => m.errorText || m.errorKey);
	const errorMessages = errorLocalizableMessages.map(localizables => localizer(...localizables) ?? "");
	const warningLocalizableMessages = warningMessagesForElement.map(m => m.errorText || m.errorKey);
	const warningMessages = warningLocalizableMessages.map(localizables => localizer(...localizables) ?? "");

	const handleFocus = (): void => {
		editorRef.current?.focus();
	};

	// AntlrCodeEditor props
	const codeCompletionShortcut = (): number => monaco?.KeyMod.Shift | monaco?.KeyCode.Space;

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

	const editorOnMount = (editor: IStandaloneCodeEditor): void => {
		editorRef.current = editor;
	};

	const externalErrorsService = new ExternalErrorsService(applyDefaultTranslations(localizer));

	const [isEditorFocused, setIsEditorFocused] = useState(false);

	const [initEditorError, setInitEditorError] = useState<Error | undefined>(undefined);

	return initEditorError ? (
		<InputElements.Warning className={"field__message"} warningMessage={initEditorError.message} />
	) : (
		<StyledBaseInput.StyledFieldMain className={addPrefix("-u-width-full")}>
			<StyledBaseInput.StyledField $block={true}>
				<InputElements.Label className={"field__label"} label={localizedLabel} dataRole="control-label" />
				{errorMessages.length > 0 && (
					<InputElements.Error
						className={"field__message"}
						errorMessage={renderErrorContent(errorMessages)}
					/>
				)}
				{warningMessages.length > 0 && (
					<InputElements.Warning
						className={"field__message"}
						warningMessage={renderErrorContent(warningMessages)}
					/>
				)}
				<StyledBaseInput.StyledFieldInput
					style={{ height: "auto" }}
					id={props.id}
					tabIndex={-1}
					onFocus={handleFocus}
					data-role={"text-output"}
					$readonly={uiConfig?.options?.readOnly}
					$error={errorMessages.length > 0}
					$warning={warningMessages.length > 0}
					$hasFocus={isEditorFocused}
				>
					<AntlrCodeEditor
						tokensProvider={tokensProvider}
						getSuggestions={getSuggestions}
						languageConfiguration={configuration}
						customTheme={customEditorTheme}
						endOfLinePreference={EndOfLineSequence.LF}
						value={String(value)}
						onValueSubmit={onValueSubmit}
						uiConfig={{
							...uiConfig,
							options: {
								...uiConfig?.options
							}
						}}
						delayFetchExternalErrors={2000}
						fetchExternalErrors={externalErrorsService.fetchExternalErrors}
						codeCompletionShortcut={codeCompletionShortcut}
						fetchContextAssistFunctionality={fetchContextAssistFunctionality}
						fetchHelpTextSupport={fetchHelpTextSupport}
						loading={<ProgressIndicator size="big" />}
						onFocus={setIsEditorFocused}
						onEditorInitFailed={setInitEditorError}
						onMount={editorOnMount}
						monacoLoader={{
							path: "vs",
							availableLanguages: {
								"*": "de"
							}
						}}
					/>
				</StyledBaseInput.StyledFieldInput>
			</StyledBaseInput.StyledField>
		</StyledBaseInput.StyledFieldMain>
	);
};

export default CodeEditorControl;
