/*
 * File taken from the project Antlr4 (https://www.antlr.org),
 * URL: https://github.com/antlr/grammars-v4/blob/master/kirikiri-tjs/JavaScript/TJSBaseParser.js
 * Modified by mgm technology partners on 2025-04-15.
 * - Migrated to ESM
 */

/**
 * MIT License
 * Copyright (c) 2014 by Bart Kiers (original author) and Alexandre Vitorelli (contributor -> ported to CSharp)
 * Copyright (c) 2017 by Ivan Kochurkin (Positive Technologies):
 *     added ECMAScript 6 support, cleared and transformed to the universal grammar.
 * Copyright (c) 2018 by Juan Alvarez (contributor -> ported to Go)
 * Copyright (c) 2019 by Student Main:
 *     modify to TJS2, expiremental Typescript target.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import antlr4 from "antlr4";
import TJSParser from "./TJSParser.js";

function TJSBaseParser(input) {
	antlr4.Parser.call(this, input);
}

TJSBaseParser.prototype = Object.create(antlr4.Parser.prototype);

TJSBaseParser.prototype.notOpenBraceAndNotFunction = function () {
	const nextTokenType = this._input.LT(1).type;
	return nextTokenType !== TJSParser.OpenBrace && nextTokenType !== TJSParser.Function;
};

TJSBaseParser.prototype.closeBrace = function () {
	return this._input.LT(1).type === TJSParser.CloseBrace;
};

TJSBaseParser.prototype.lineTerminatorAhead = function () {
	let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
	let ahead = this._input.get(possibleIndexEosToken);
	if (ahead.channel !== antlr4.Lexer.HIDDEN) {
		return false;
	}

	if (ahead.type === TJSParser.LineTerminator) {
		return true;
	}

	if (ahead.type === TJSParser.WhiteSpaces) {
		possibleIndexEosToken = this.getCurrentToken().getTokenIndex() - 2;
		ahead = this._input.get(possibleIndexEosToken);
	}

	const text = ahead.type;
	const type = ahead.type;

	return (
		(type === TJSParser.MultiLineComment && (text.includes("\r") || text.includes("\n"))) ||
		type === TJSParser.LineTerminator
	);
};

export { TJSBaseParser };
