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

import {
	DefaultErrorStrategy,
	FailedPredicateException,
	InputMismatchException,
	Interval,
	NoViableAltException,
	Parser,
	ParserRuleContext,
	RecognitionException,
	Token
} from "antlr4";

import { escapeWS, toTokenString } from "../utils/CodeStringUtils.js";
import type { IAntlrDictionary } from "../types/index.js";
import { AntlrCodeEditorTemplateResolver } from "../localization/LocalizationUtils.js";

/**
 * Most parts of this class are overridden from `antlr4` library.
 * We override them for 2 purposes:
 * * Implement a recovery method after encountering an error token
 * * Override error messages
 */
export class CommonErrorStrategy extends DefaultErrorStrategy {
	/**
	 * We use the dictionary for looking up tokens. We don't have to recreate an empty lexer everytime.
	 */
	private readonly dictionary: IAntlrDictionary;

	constructor(dictionary: IAntlrDictionary) {
		super();
		this.dictionary = dictionary;
	}

	reportError = (recognizer: Parser, e: RecognitionException): void => {
		if (!e) {
			return;
		}
		if (super.inErrorRecoveryMode(recognizer)) {
			return; // don't report spurious errors
		}
		super.beginErrorCondition(recognizer);

		/**
		 * If integrating projects use ESM for their bundle target, instanceof in DefaultErrorStrategy cannot work correctly.
		 */
		const errorType = e.constructor["name"];
		switch (errorType) {
			case NoViableAltException.name:
				this.reportNoViableAlternative(recognizer, e as NoViableAltException);
				break;
			case InputMismatchException.name:
				this.reportInputMismatch(recognizer, e);
				break;
			case FailedPredicateException.name:
				this.reportFailedPredicate(recognizer, e);
				break;
			default:
				if (e.offendingToken) {
					recognizer.notifyErrorListeners(e.message, e.offendingToken, e);
				}
		}
	};

	recoverInline = (recognizer: Parser): Token => {
		try {
			return super.recoverInline(recognizer);
		} catch {
			// In antlr's code, they throw exception here, but it would stop parsing process
			return recognizer.getCurrentToken();
		}
	};

	reportUnwantedToken = (recognizer: Parser): void => {
		if (super.inErrorRecoveryMode(recognizer)) {
			return;
		}

		super.beginErrorCondition(recognizer);

		const currentToken = recognizer.getCurrentToken();
		const actualTokenName = this.getTokenErrorDisplay(currentToken);
		const expecting = recognizer.getExpectedTokens();
		const expectedTokenName = toTokenString(this.dictionary, expecting);
		const str = AntlrCodeEditorTemplateResolver.resolve("antlrCodeEditor.error.unwantedToken", {
			actualTokenName,
			expectedTokenName
		});

		recognizer.notifyErrorListeners(str, currentToken, undefined);
	};

	reportMissingToken = (recognizer: Parser): void => {
		if (this.inErrorRecoveryMode(recognizer)) {
			return;
		}
		super.beginErrorCondition(recognizer);

		const t = recognizer.getCurrentToken();
		const expecting = recognizer.getExpectedTokens();
		const expectedToken = toTokenString(this.dictionary, expecting);
		const errorToken = this.getTokenErrorDisplay(t);

		const str = AntlrCodeEditorTemplateResolver.resolve("antlrCodeEditor.error.missingToken", {
			expectedToken,
			errorToken
		});

		recognizer.notifyErrorListeners(str, t, undefined);
	};

	getTokenErrorDisplay = (token: Token): string => {
		const { type, text } = token;
		if (token === null) {
			return "<no token>";
		}
		return text === null ? (type === Token.EOF ? "<EOF>" : `<${type}>`) : `'${text}'`;
	};

	reportNoViableAlternative = (recognizer: Parser, error: NoViableAltException): void => {
		const tokens = recognizer.getTokenStream();

		const { startToken, offendingToken } = error;

		const expecting = recognizer.getExpectedTokens();
		const expectedTokens = toTokenString(this.dictionary, expecting);

		const input: string =
			tokens !== null && offendingToken
				? startToken.type === Token.EOF
					? "<EOF>"
					: escapeWS(tokens.getText(new Interval(startToken.tokenIndex, offendingToken.tokenIndex)))
				: "<unknown input>";

		if (input && input.trim() && offendingToken) {
			const str = AntlrCodeEditorTemplateResolver.resolve("antlrCodeEditor.error.noViableAlternative", {
				expectedTokens,
				input
			});

			recognizer.notifyErrorListeners(str, offendingToken, error);
		}
	};

	reportInputMismatch = (recognizer: Parser, error: RecognitionException): void => {
		const expecting = recognizer.getExpectedTokens();

		const { offendingToken } = error;
		if (offendingToken) {
			const actualInput = this.getTokenErrorDisplay(offendingToken);
			const expectedInput = toTokenString(this.dictionary, expecting);
			const str = AntlrCodeEditorTemplateResolver.resolve("antlrCodeEditor.error.inputMismatch", {
				actualInput,
				expectedInput
			});

			recognizer.notifyErrorListeners(str, offendingToken, error);
		}
	};

	reportFailedPredicate = (recognizer: Parser, error: RecognitionException): void => {
		const { message, offendingToken } = error;

		if (offendingToken) {
			const ruleName =
				(recognizer as RuleParser).ruleNames[(recognizer._ctx as IndexedParserRuleContext).ruleIndex] || "";
			const str = AntlrCodeEditorTemplateResolver.resolve("antlrCodeEditor.error.failedPredicate", {
				ruleName,
				message
			});

			recognizer.notifyErrorListeners(str, offendingToken, error);
		}
	};

	sync(recognizer: Parser): void {
		try {
			super.sync(recognizer);
		} catch {
			// Ignore error from sync
			return;
		}
	}
}

type IndexedParserRuleContext = ParserRuleContext & {
	ruleIndex: number;
};

type RuleParser = Parser & {
	ruleNames: string[];
};
