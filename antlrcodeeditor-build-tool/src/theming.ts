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

import fs from "fs";
import path from "path";
import os from "os";

import { getTheming, stringify } from "./theming.utils.js";

const LEXER_NAME = process.env.LEXER_NAME;
const PARSER_NAME = process.env.PARSER_NAME;
const GRAMMAR_FILE = process.env.GRAMMAR_FILE;
const LANGUAGE = process.env.LANGUAGE;
const OUTPUT_DIR = process.env.OUTPUT_DIR;

const lexerName = LEXER_NAME || `${GRAMMAR_FILE}Lexer`;
const parserName = PARSER_NAME || `${GRAMMAR_FILE}Parser`;
const language = LANGUAGE ?? "";

if (!OUTPUT_DIR) {
	throw new Error("Output directory is missing");
}

const normalizeImportPath = (...paths: string[]): string => {
	const absolutePath = path.resolve(...paths);
	const isWindows = os.platform() === "win32";

	return isWindows ? `file://${absolutePath}` : absolutePath;
};

import(normalizeImportPath(OUTPUT_DIR, `${lexerName}.ts`)).then(module => {
	const lexer = module.default;

	// region Write theming file
	const themingFile = `
import { IStandaloneThemeData } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";

export const theme: IStandaloneThemeData = ${stringify(getTheming(lexer, language))};
`.slice(1);
	fs.writeFileSync(`${OUTPUT_DIR}/${language}.theme.ts`, themingFile);
	// endregion
});

// region Write index.ts for importing
const indexFile = `
import ${lexerName} from "./${lexerName}.js";
import ${parserName} from "./${parserName}.js";
import { theme } from "./${language}.theme.js";

export {${lexerName}, ${parserName}, theme}
`.slice(1);
fs.writeFileSync(`${OUTPUT_DIR}/index.ts`, indexFile);
// endregion

// region Write Parser and Lexer file to ignore TypeScript and Eslint checking
const header = "// @ts-nocheck ignore check\n/* eslint-disable */\n";
[`${OUTPUT_DIR}/${lexerName}.ts`, `${OUTPUT_DIR}/${parserName}.ts`].forEach(file => {
	fs.writeFileSync(file, header + fs.readFileSync(file, "utf8"));
});
// endregion
