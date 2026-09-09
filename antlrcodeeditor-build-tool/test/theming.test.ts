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

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const PACKAGE_DIR = path.resolve(fileURLToPath(import.meta.url), "../..");
const THEMING_SCRIPT = path.join(PACKAGE_DIR, "src/theming.ts");

const MOCK_LEXER_CONTENT = `
export default class MockLexer {
    static symbolicNames = [null, "KEYWORD", "IDENTIFIER", "STRING_LITERAL"];
}
`.trimStart();

const TS_NOCHECK_HEADER = "// @ts-nocheck ignore check\n/* eslint-disable */\n";

const runTheming = (env: Record<string, string>) =>
	spawnSync("node", ["--loader", "ts-node/esm", THEMING_SCRIPT], {
		env: { ...process.env, ...env },
		encoding: "utf-8",
		cwd: PACKAGE_DIR
	});

describe("theming.ts end-to-end", () => {
	let outputDir: string;

	beforeEach(() => {
		// Must be inside PACKAGE_DIR — ts-node/esm rejects dynamic imports from outside project root
		outputDir = fs.mkdtempSync(path.join(PACKAGE_DIR, "theming-e2e-"));
	});

	afterEach(() => {
		spawnSync("rm", ["-rf", outputDir]);
	});

	describe("missing OUTPUT_DIR", () => {
		it("exits with non-zero status and prints error", () => {
			const result = runTheming({ OUTPUT_DIR: "" });
			expect(result.status).not.toBe(0);
			expect(result.stderr).toContain("Output directory is missing");
		});
	});

	describe("with valid inputs", () => {
		const LANGUAGE = "testlang";
		const LEXER_NAME = "MockLexer";
		const PARSER_NAME = "MockParser";

		beforeEach(() => {
			fs.writeFileSync(path.join(outputDir, `${LEXER_NAME}.ts`), MOCK_LEXER_CONTENT);
			fs.writeFileSync(path.join(outputDir, `${PARSER_NAME}.ts`), "export default class MockParser {}");
		});

		const run = () =>
			runTheming({
				OUTPUT_DIR: outputDir,
				LEXER_NAME,
				PARSER_NAME,
				LANGUAGE
			});

		it("exits successfully", () => {
			const result = run();
			expect(result.status).toBe(0);
		});

		it("writes theme file with correct structure", () => {
			run();
			const themeFile = fs.readFileSync(path.join(outputDir, `${LANGUAGE}.theme.ts`), "utf-8");
			expect(themeFile).toMatchSnapshot();
		});

		it("theme file contains token rules for each symbolic name", () => {
			run();
			const themeFile = fs.readFileSync(path.join(outputDir, `${LANGUAGE}.theme.ts`), "utf-8");
			expect(themeFile).toContain(`keyword.${LANGUAGE}`);
			expect(themeFile).toContain(`identifier.${LANGUAGE}`);
			expect(themeFile).toContain(`string_literal.${LANGUAGE}`);
		});

		it("theme file contains UNNAMED token rule", () => {
			run();
			const themeFile = fs.readFileSync(path.join(outputDir, `${LANGUAGE}.theme.ts`), "utf-8");
			expect(themeFile).toContain(`UNNAMED.${LANGUAGE}`);
		});

		it("theme file imports IStandaloneThemeData from core package", () => {
			run();
			const themeFile = fs.readFileSync(path.join(outputDir, `${LANGUAGE}.theme.ts`), "utf-8");
			expect(themeFile).toContain(
				`import { IStandaloneThemeData } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core"`
			);
		});

		it("writes index.ts with correct imports and exports", () => {
			run();
			const indexFile = fs.readFileSync(path.join(outputDir, "index.ts"), "utf-8");
			expect(indexFile).toMatchSnapshot();
		});

		it("index.ts imports lexer, parser and theme", () => {
			run();
			const indexFile = fs.readFileSync(path.join(outputDir, "index.ts"), "utf-8");
			expect(indexFile).toContain(`import ${LEXER_NAME} from "./${LEXER_NAME}.js"`);
			expect(indexFile).toContain(`import ${PARSER_NAME} from "./${PARSER_NAME}.js"`);
			expect(indexFile).toContain(`import { theme } from "./${LANGUAGE}.theme.js"`);
			expect(indexFile).toContain(`export {${LEXER_NAME}, ${PARSER_NAME}, theme}`);
		});

		it("prepends ts-nocheck header to lexer file", () => {
			run();
			const lexerFile = fs.readFileSync(path.join(outputDir, `${LEXER_NAME}.ts`), "utf-8");
			expect(lexerFile.startsWith(TS_NOCHECK_HEADER)).toBe(true);
		});

		it("prepends ts-nocheck header to parser file", () => {
			run();
			const parserFile = fs.readFileSync(path.join(outputDir, `${PARSER_NAME}.ts`), "utf-8");
			expect(parserFile.startsWith(TS_NOCHECK_HEADER)).toBe(true);
		});

		it("lexer file retains original content after prepend", () => {
			run();
			const lexerFile = fs.readFileSync(path.join(outputDir, `${LEXER_NAME}.ts`), "utf-8");
			expect(lexerFile).toContain("export default class MockLexer");
		});
	});

	describe("GRAMMAR_FILE fallback naming", () => {
		const LANGUAGE = "scss";
		const GRAMMAR_FILE = "Scss";

		beforeEach(() => {
			fs.writeFileSync(path.join(outputDir, "ScssLexer.ts"), MOCK_LEXER_CONTENT);
			fs.writeFileSync(path.join(outputDir, "ScssParser.ts"), "export default class ScssParser {}");
		});

		it("derives lexer and parser names from GRAMMAR_FILE", () => {
			const result = runTheming({
				OUTPUT_DIR: outputDir,
				GRAMMAR_FILE,
				LANGUAGE
			});
			expect(result.status).toBe(0);

			const indexFile = fs.readFileSync(path.join(outputDir, "index.ts"), "utf-8");
			expect(indexFile).toContain("import ScssLexer");
			expect(indexFile).toContain("import ScssParser");
		});
	});
});
