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

import path from "path";
import fs from "fs";

import notice from "eslint-plugin-notice";
import * as parserPlain from "eslint-parser-plain";
import lodash from "eslint-plugin-lodash";
import jsdoc from "eslint-plugin-jsdoc";

import { reactStrict } from "@com.mgmtp.a12.devtools/eslint-config";

function escapeStringRegExp(str) {
	return str.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}

/**
 * Creates a notice configuration for eslint-plugin-notice based on a license template file.
 * @param {string} licenseFileName - The name of the license file (e.g., "dual-license.js", "apache.js")
 * @returns {{ mustMatch: RegExp, onNonMatchingHeader: string, template: string }}
 */
function createNoticeConfig(licenseFileName) {
	const __dirname = import.meta.dirname;
	const templateFilePath = path.join(__dirname, "./license-header", licenseFileName);
	const templateContent = fs.readFileSync(templateFilePath, "utf-8");
	const YEAR = new Date().getFullYear().toString();
	const templateContentWithYear = templateContent.replaceAll("<%= YEAR %>", YEAR).replaceAll("\r\n", "\n");

	/**
	 * There can be some module docs that can go before the license notice, we need to match them.
	 * @type {string}
	 */
	const anyJsDocsPattern = "((\\/\\*\\*\\s*\\n([^\\*]|(\\*(?!\\/)))*\\*\\/\\n)|(#!(.+)))?\n*";

	/**
	 * Escape the template file and append the optional JSDocs pattern before it.
	 * @type {string}
	 */
	const templateFilePattern = anyJsDocsPattern + escapeStringRegExp(templateContentWithYear);

	/**
	 * The regex to match the valid license note, if the file header doesn't match,
	 * it will be replaced by the templateContent.
	 * @type {RegExp}
	 */
	const templateFileRegex = new RegExp(templateFilePattern, "s");

	return {
		mustMatch: templateFileRegex,
		onNonMatchingHeader: "replace",
		template: templateContent,
		templateVars: {
			YEAR
		},
		chars: 2000 // Hard-coded because we don't know the length of additional jsdocs
	};
}

const dualLicenseConfig = createNoticeConfig("dual-license.js");

/** @type { import("eslint").Linter.Config[] } */
const config = [
	...reactStrict,
	{
		name: "antlrcodeeditor/ignores",
		ignores: [
			"**/node_modules",
			"**/target",
			"**/dist",
			"**/build",
			"**/gen",
			"**/.gradle",
			"**/lib",
			"**/src/config/grammar",
			"**/resources/grammar-with-base-classes",
			"**/html/models",
			"license-header/*.js",
			"upgrade-version-scripts/*.js"
		]
	},
	{
		name: "antlrcodeeditor/general",
		files: ["**/*.ts", "**/*.tsx", "**/*.js"],
		plugins: {
			notice,
			lodash,
			jsdoc
		},
		rules: {
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-empty-interface": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-non-null-assertion": "warn",
			"no-unused-vars": "warn",
			"no-prototype-builtins": "warn",
			"no-inner-declarations": "off",
			"no-async-promise-executor": "warn",
			"no-useless-escape": "warn",
			"require-yield": "warn",
			"@typescript-eslint/explicit-function-return-type": [
				"warn",
				{
					allowExpressions: true
				}
			],
			"@typescript-eslint/naming-convention": [
				"warn",
				{
					selector: "interface",
					format: ["PascalCase"],
					prefix: ["I"]
				}
			],
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{
					"ts-ignore": "allow-with-description",
					"ts-nocheck": "allow-with-description"
				}
			],
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/triple-slash-reference": "off",
			"notice/notice": ["error", dualLicenseConfig],
			"react-hooks/exhaustive-deps": "warn",
			"react/react-in-jsx-scope": "off",
			"react-hooks/refs": "off",
			"react-hooks/immutability": "off",
			"react-hooks/static-components": "off",
			"lodash/import-scope": [2, "method"]
		}
	},
	{
		name: "antlrcodeeditor/build-tool",
		plugins: {
			notice
		},
		files: ["antlrcodeeditor-build-tool/build.gradle"],
		languageOptions: {
			parser: parserPlain
		},
		rules: {
			"notice/notice": ["error", dualLicenseConfig]
		}
	},
	{
		name: "antlrcodeeditor/javascript",
		files: ["*.js"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-var-requires": "off",
			"no-undef": "warn"
		}
	}
];

export default config;
