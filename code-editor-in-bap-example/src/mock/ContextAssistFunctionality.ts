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

import { Position } from "monaco-editor";

import { IAsyncSuggestion, ITokenForAsyncContextAssist } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";

/**
 * Using the timeout to mock the context assist functionality API
 * from the server, which takes 500 milliseconds to return the result
 *
 * @param currentTokenStream - Current Token Stream
 * @param cursorPosition - Current cursor position
 */
const mockContextAssistFunctionalityApi = (
	currentTokenStream: ITokenForAsyncContextAssist[],
	cursorPosition: Position
): Promise<IAsyncSuggestion[]> => {
	return new Promise(resolve => {
		setTimeout(
			() =>
				resolve([
					{
						text: "A2BC8987",
						kind: monaco?.languages.CompletionItemKind.Field
					},
					{
						text: "AB123",
						kind: monaco?.languages.CompletionItemKind.Field
					},

					{
						text: "ADXY789",
						kind: monaco?.languages.CompletionItemKind.Field
					}
				]),
			500
		);
	});
};

/**
 * Function for fetching context assist functionality from the server
 *
 * @param currentTokenStream - Current Token Stream
 * @param cursorPosition - Current cursor position
 */
export const fetchContextAssistFunctionality = async (
	currentTokenStream: ITokenForAsyncContextAssist[],
	cursorPosition: Position
): Promise<IAsyncSuggestion[]> => {
	return await mockContextAssistFunctionalityApi(currentTokenStream, cursorPosition);
};
