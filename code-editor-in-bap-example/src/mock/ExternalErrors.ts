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

import { ValidationError } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";
import { type LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization";

import { RESOURCE_KEYS } from "../localization/index.js";

export class ExternalErrorsService {
	constructor(private localizer: (key: string, args?: LocalizableArgs | undefined) => string) {}

	/**
	 * Function for finding all token indexes in a word
	 *
	 * @param word
	 * @param token
	 */
	private findTokenInWord(word: string, token: string): number[] {
		if (word.length < token.length * 2) {
			return [word.indexOf(token)];
		}
		const indexes: number[] = [];
		let count = 0;
		while (word.indexOf(token) !== -1) {
			const index = word.indexOf(token);
			indexes.push(index + count);
			count += word.slice(0, index + token.length).length;
			word = word.slice(index + token.length);
		}
		return indexes;
	}

	/**
	 * Function for getting all "blue" words for the demo in the input text
	 * and convert it into ValidationError based on its position
	 *
	 * @param input - The code for verifying external errors
	 */
	private getExternalErrorsFromEditor(input: string): ValidationError[] {
		const wrongToken = "blue";
		const externalErrors: ValidationError[] = [];
		const wordsArray: string[][] = input.split("\n").map((e: string) => e.split(" "));
		wordsArray.forEach((wordsPerRow: string[], rowIndex: number) => {
			let lengthPerWord = 0;
			wordsPerRow.forEach((word: string) => {
				if (word.indexOf(wrongToken) !== -1) {
					const wrongTokenIndexes = this.findTokenInWord(word, wrongToken);
					wrongTokenIndexes.forEach((index: number) => {
						/*
						Column and line index, which calculated above, start at 0.
						However, when marking errors to the monaco editor, they must start at 1.
						 */
						externalErrors.push({
							message: this.localizer(RESOURCE_KEYS.mock.externalError.message),
							startCol: lengthPerWord + 1 + index,
							endCol: lengthPerWord + 1 + wrongToken.length + index,
							startLine: rowIndex + 1,
							endLine: rowIndex + 1
						});
					});
				}
				lengthPerWord += word.length + 1;
			});
		});
		return externalErrors;
	}

	/**
	 * Using the timeout to mock the external errors API
	 * from the server, which takes 500 milliseconds to return the result
	 *
	 * @param input - The code for verifying external errors
	 */
	private mockExternalErrorsApi(input: string): Promise<ValidationError[]> {
		return new Promise(resolve => {
			setTimeout(() => resolve(this.getExternalErrorsFromEditor(input)), 500);
		});
	}

	/**
	 * Function for fetching external errors from the server
	 *
	 * @param input - The code for verifying external errors
	 */
	public fetchExternalErrors = async (input: string): Promise<ValidationError[]> => {
		const externalErrors = await this.mockExternalErrorsApi(input);
		return externalErrors;
	};
}
