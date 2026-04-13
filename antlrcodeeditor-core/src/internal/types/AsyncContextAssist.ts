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

export interface IAsyncSuggestion {
	/**
	 * The suggestion's text, which is displayed on the editor
	 */
	text: string;

	/**
	 * Kind of the suggestion e.g. Method, Function, Constructor, etc.
	 */
	kind?: monaco.languages.CompletionItemKind;
}

/**
 * Token for requesting to the server via context assist functionality API
 */
export interface ITokenForAsyncContextAssist {
	/**
	 * The token's text, which is displayed on the editor
	 */
	text: string;

	/**
	 * The token's type id, which is defined by lexer
	 */
	type: number;

	/**
	 * The token's type name, which is defined by lexer
	 */
	typeName: string;

	/**
	 * The token's starting column, which begins at 0
	 */
	column: number;

	/**
	 * The token's line, which begins at 0
	 */
	lineNumber: number;

	/**
	 * The token's starting index in the whole text of the editor
	 */
	start: number;

	/**
	 * The token's ending index in the whole text of the editor
	 */
	stop: number;
}
