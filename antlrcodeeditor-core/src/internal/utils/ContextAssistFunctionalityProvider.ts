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

import type { IAsyncSuggestion, ITokenForAsyncContextAssist } from "../types/AsyncContextAssist.js";

import { getSuggestionRange } from "./CodeEditorUtils.js";
import { CommonTokensProvider } from "./CommonTokensProvider.js";

export class ContextAssistFunctionalityProvider implements monaco.languages.CompletionItemProvider {
	private readonly modelId: string;
	private tokensProvider: CommonTokensProvider;
	private fetchContextAssist: (
		currentTokenStream: ITokenForAsyncContextAssist[],
		cursorPosition: monaco.Position
	) => Promise<IAsyncSuggestion[]>;

	constructor(
		modelId: string,
		tokensProvider: CommonTokensProvider,
		fetchContextAssist: (
			currentTokenStream: ITokenForAsyncContextAssist[],
			cursorPosition: monaco.Position
		) => Promise<IAsyncSuggestion[]>
	) {
		this.modelId = modelId;
		this.tokensProvider = tokensProvider;
		this.fetchContextAssist = fetchContextAssist;
	}

	provideCompletionItems = (
		model: monaco.editor.ITextModel,
		position: monaco.Position,
		context: monaco.languages.CompletionContext,
		cancellationToken: monaco.CancellationToken
	): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
		const suggestionsList: monaco.languages.CompletionItem[] = [];
		if (model.id === this.modelId) {
			const range: monaco.IRange = getSuggestionRange(model, position);
			return new Promise(resolve => {
				this.fetchContextAssist(
					this.tokensProvider.getAllTokens(model.getValue()),
					/*
					The column in the cursor position getting from monaco is initialized at 1
					Therefore, we have to minus 1 to synchronize with the column in tokens
					 */
					position.with(position.lineNumber, position.column - 1)
				)?.then(result => {
					result.forEach(e => {
						suggestionsList.push({
							label: e.text,
							insertText: e.text,
							kind: e.kind ?? monaco.languages.CompletionItemKind.Variable,
							range
						});
					});
					resolve({
						suggestions: suggestionsList
					});
				});
			});
		}
		return null;
	};
}
