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

import { CharStream, CommonTokenStream, Lexer, Parser } from "antlr4";

import { CommonErrorStrategy } from "../errors/CommonErrorStrategy.js";
import { LexerCollectorErrorListener } from "../errors/LexerCollectorErrorListener.js";
import { ParserCollectorErrorListener } from "../errors/ParserCollectorErrorListener.js";
import { ValidationError } from "../errors/ValidationError.js";
import { AntlrCodeEditorTemplateResolver } from "../localization/LocalizationUtils.js";
import { ITokenForAsyncContextAssist } from "../types/AsyncContextAssist.js";
import { IAntlrDictionary, ICommonTokensProviderProps } from "../types/MonacoConfig.js";

import { removeSingleQuote } from "./CodeStringUtils.js";

import IToken = monaco.languages.IToken;
import ILineTokens = monaco.languages.ILineTokens;
import IState = monaco.languages.IState;
import TokensProvider = monaco.languages.TokensProvider;

/**
 * Interpret Lexer and Parser to create a tokenizer as well as a syntax validator.
 *
 * Can be used as monaco-editor's `TokensProvider`.
 *
 * Use `validate()` alone to validate any piece of code.
 * @example
 * 	// Css3 grammar, with top-level validation rule `stylesheet`
 * 	const codeInput = "div { color: red; }";
 * 	const validationErrors = tokensProvider.validate(codeInput);
 * 	const hasValidationError = validationErrors.length > 0;
 */
export class CommonTokensProvider implements TokensProvider {
	public dictionary: IAntlrDictionary = [];

	private readonly emptyLexer: Lexer;
	private readonly parserInstance: Parser;
	private readonly lexerErrorListener: LexerCollectorErrorListener | undefined;
	private readonly parserErrorListener: ParserCollectorErrorListener | undefined;

	/**
	 * 1. First, we create an empty lexer.
	 * This empty lexer is used to initialize the dictionary, which will be used for the lookup purpose later on.
	 * 2. The `lexerErrorListener` and `parserInstance` are created only once.
	 * Everytime you need to use them, you can just `reset()` them.
	 */
	constructor(private props: ICommonTokensProviderProps) {
		this.emptyLexer = this.createLexer("");

		this.dictionary = this.initializeDictionary();

		this.parserInstance = this.getNewParser(new CommonTokenStream(this.emptyLexer));
		this.parserInstance.removeErrorListeners();

		if (!props.disabledDefaultGrammarValidation) {
			this.lexerErrorListener = new LexerCollectorErrorListener();
			this.parserErrorListener = new ParserCollectorErrorListener();
			this.parserInstance.addErrorListener(this.parserErrorListener);
			this.parserInstance._errHandler = new CommonErrorStrategy(this.dictionary);
		}

		AntlrCodeEditorTemplateResolver.init(this.props.errorTemplates);
	}

	getLanguageName = (): string => this.props.language;

	private getNewLexer = (chars: CharStream): Lexer => {
		return new this.props.lexer(chars);
	};

	private getNewParser = (chars: CommonTokenStream): Parser => {
		return new this.props.parser(chars);
	};

	private createLexer = (input: string): Lexer => {
		const chars = new CharStream(input);
		return this.getNewLexer(chars);
	};

	/**
	 * The code block will be validated against the `rootRuleName`.
	 * Returned value is an array of `ValidationError`. If the return array is empty, the code is valid.
	 *
	 * This method is public and can be used to validate any code block.
	 *
	 * @param input - any code block
	 */
	validate = (input: string): ValidationError[] => {
		if (!this.props.disabledDefaultGrammarValidation && this.lexerErrorListener && this.parserErrorListener) {
			const lexer = this.createLexer(input);
			lexer.removeErrorListeners();
			lexer.addErrorListener(this.lexerErrorListener);
			this.lexerErrorListener.reset();

			this.parserInstance.reset();
			this.parserInstance.setTokenStream(new CommonTokenStream(lexer));
			this.parserErrorListener.reset();

			// @ts-ignore FIXME find another way to remove ts-ignore
			this.parserInstance[this.props.rootRuleName]();

			return [...this.parserErrorListener.errors, ...this.lexerErrorListener.errors];
		}
		return [];
	};

	/**
	 * Tokenize a line of code using lexer.
	 *
	 * We have to remove the default `ErrorListener` of the lexer,
	 * because we've already used the antlr4 to validate the whole code block.
	 *
	 * @param input - a line of code
	 */
	private tokensForLine = (input: string): ILineTokens => {
		const lexer: Lexer = this.createLexer(input);
		lexer.removeErrorListeners();

		const myTokens: IToken[] = lexer.getAllTokens().map(token => {
			const tokenTypeName: string | null = this.props.lexer.symbolicNames[token.type];
			return this.getToken(tokenTypeName, token.column);
		});
		myTokens.sort((a, b) => (a.startIndex > b.startIndex ? 1 : -1));

		return this.getLineTokens(myTokens);
	};

	private getToken = (ruleName: string | null, startIndex: number): IToken => ({
		scopes: this.getTokenName(ruleName),
		startIndex
	});

	private getTokenName = (ruleName: string | null): string =>
		`${ruleName?.toLowerCase() || "UNNAMED"}.${this.props.language}`;

	private getLineTokens = (tokens: IToken[]): ILineTokens => ({
		endState: new CommonState(),
		tokens
	});

	// region As we implement `TokensProvider` interface, we need to implement these 2 method
	getInitialState = (): IState => new CommonState();

	/**
	 * By default, monaco-editor only tokenizes the code line-by-line.
	 * Therefore, we need to use lexer to tokenize a line of code.
	 *
	 * **Note:** On the other hand, we need to validate the whole code block against the `rootRuleName`.
	 */
	tokenize = (line: string, state: IState): ILineTokens => {
		// So far we ignore the state, which is not great for performance reasons
		return this.tokensForLine(line);
	};
	// endregion

	/**
	 * By default, monaco-editor only tokenizes the code line-by-line.
	 * When it comes to the need of token's column, monaco-editor cannot provide appropriate values.
	 *
	 * Function for getting all tokens from the editor's text
	 *
	 * @param input - text for getting all tokens
	 */
	getAllTokens = (input: string): ITokenForAsyncContextAssist[] => {
		const lexer: Lexer = this.createLexer(input);
		lexer.removeErrorListeners();
		return lexer.getAllTokens().map(token => {
			const tokenTypeName: string | null = this.props.lexer.symbolicNames[token.type];
			return {
				text: token.text,
				type: token.type,
				typeName: this.getToken(tokenTypeName, token.column).scopes,
				column: token.column,
				lineNumber: token.line,
				start: token.start,
				stop: token.stop
			};
		});
	};

	private initializeDictionary = (): IAntlrDictionary => {
		const dictionary: IAntlrDictionary = [];
		for (let i = 0; i < this.props.lexer.symbolicNames.length; i++) {
			const text = removeSingleQuote(this.props.lexer.literalNames[i]);
			const token = this.props.lexer.symbolicNames[i];
			if (token) {
				dictionary.push({
					text,
					token,
					tokenType: i
				});
			}
		}
		return dictionary;
	};

	/**
	 * Keywords should not start by number, and must contains word character
	 *
	 * @see https://regex101.com/r/XC8Z0i/3
	 */
	getAllPossibleKeywords = (): IAntlrDictionary =>
		this.dictionary.filter(({ text }) => text && text.match(/^[^0-9]*[a-zA-Z]+.*$/));
}

/** @internal */
class CommonState implements IState {
	clone(): IState {
		return new CommonState();
	}

	equals(other: IState): boolean {
		return true;
	}
}
