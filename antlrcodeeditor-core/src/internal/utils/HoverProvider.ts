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

import { languages } from "monaco-editor";

import { ITokenForAsyncContextAssist } from "../types/AsyncContextAssist.js";

import { CommonTokensProvider } from "./CommonTokensProvider.js";

import HoverProvider = languages.HoverProvider;

/**
 * The help text hover provider.
 *
 * @param editorModelId The current editor model id
 * @param fetchHelpTextSupport the callback to get the help text for current token in Markdown
 * @param tokensProvider token provider to get the token stream and cursor's position
 */
export const hoverProvider = (
	editorModelId: string,
	fetchHelpTextSupport: (
		currentTokenStream: ITokenForAsyncContextAssist[],
		cursorPosition: monaco.Position
	) => Promise<monaco.IMarkdownString[]>,
	tokensProvider: CommonTokensProvider
): HoverProvider => ({
	provideHover: async function (model, position) {
		if (editorModelId == model.id) {
			const wordAtPosition = model.getWordAtPosition(position);
			if (wordAtPosition) {
				const helpText = await fetchHelpTextSupport(
					tokensProvider.getAllTokens(model.getValue()),
					/*
					The column in the cursor position getting from monaco is initialized at 1
					Therefore, we have to minus 1 to synchronize with the column in tokens
					 */
					position.with(position.lineNumber, position.column - 1)
				);
				return {
					range: new monaco.Range(
						position.lineNumber,
						wordAtPosition.startColumn,
						position.lineNumber,
						wordAtPosition.endColumn
					),
					contents: helpText
				};
			}
		}
		return null;
	}
});
