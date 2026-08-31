#!/usr/bin/env node

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
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import yargs from "yargs/yargs.js";

import paramKeys from "./constants/paramKeys.js";
import commands from "./constants/commands.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PARAM_SET = {
	baseParams: [paramKeys.ANTLR_SRC, paramKeys.LANGUAGE, paramKeys.TARGET_DIR],
	runBuildTool: [paramKeys.LEXER_NAME, paramKeys.PARSER_NAME],
	runBuildToolWithBaseClassesSupport: [
		paramKeys.LEXER_NAME,
		paramKeys.PARSER_NAME,
		paramKeys.BASE_LEXER_NAME,
		paramKeys.BASE_PARSER_NAME
	],
	runBuildToolWithSingleGrammarFileSupport: [paramKeys.GRAMMAR_FILE],
	gradleParams: [paramKeys.INIT_SCRIPT]
};

const getValidSnakeCasedProperties = (command, argv) => {
	const validProperties = [...PARAM_SET.baseParams, ...PARAM_SET[command]];
	return Object.keys(argv).reduce((properties, paramKey) => {
		return validProperties.includes(paramKey)
			? {
					...properties,
					[paramKey.toUpperCase().replace("-", "_")]: argv[paramKey]
				}
			: properties;
	}, {});
};

const getGradleParams = argv => {
	return Object.keys(argv).reduce((gradleParams, currentParam) => {
		return PARAM_SET.gradleParams.includes(currentParam)
			? {
					...gradleParams,
					[currentParam]: argv[currentParam]
				}
			: gradleParams;
	}, {});
};

const getArgsList = argv => {
	const command = argv._[0];
	const properties = getValidSnakeCasedProperties(command, argv);
	const gradleParams = getGradleParams(argv);

	const { ANTLR_SRC, TARGET_DIR } = properties;
	const propertiesWithAbsolutePath = {
		...properties,
		...(ANTLR_SRC && { ANTLR_SRC: `"${path.resolve(ANTLR_SRC)}"` }),
		...(TARGET_DIR && { TARGET_DIR: `"${path.resolve(TARGET_DIR)}"` }),
		GEN_JS_SRC: `"${path.resolve(__dirname, "..", "gen", "grammar")}"`
	};

	const initScript = gradleParams[paramKeys.INIT_SCRIPT];

	const gradleParamsWithAbsolutePath = {
		...gradleParams,
		...(initScript && { [paramKeys.INIT_SCRIPT]: path.resolve(initScript) })
	};
	const argsList = Object.keys(propertiesWithAbsolutePath).map(key => `-P${key}=${propertiesWithAbsolutePath[key]}`);
	const paramList = Object.keys(gradleParamsWithAbsolutePath).map(
		key => `--${key}=${gradleParamsWithAbsolutePath[key]}`
	);
	return [command, ...argsList, ...paramList];
};

const spawnGradleCommand = argv => {
	const gradleArgsList = getArgsList(argv);
	const executionDir = path.resolve(__dirname, "..");
	const gradleWrapperPath = argv[paramKeys.GRADLE_WRAPPER_PATH];

	let gradleExecutable = "gradle";
	if (gradleWrapperPath && process.platform === "win32") {
		gradleExecutable = path.resolve(gradleWrapperPath, "gradlew.bat");
	} else if (gradleWrapperPath) {
		gradleExecutable = path.resolve(gradleWrapperPath, "gradlew");
	}

	spawnSync(`"${gradleExecutable}"`, gradleArgsList, {
		cwd: executionDir,
		stdio: "inherit",
		shell: true
	});
};

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(process.argv.slice(2))
	.scriptName("")
	.usage("Usage: antlr4-buildtool [options]")
	.command(
		commands.runBuildTool,
		"Run build tool with only Lexer and Parser files",
		config => {
			return config.demandOption(PARAM_SET.runBuildTool);
		},
		spawnGradleCommand
	)
	.command(
		commands.runBuildToolWithBaseClassesSupport,
		"Run the build tool with base classes",
		config => {
			return config.demandOption(PARAM_SET.runBuildToolWithBaseClassesSupport);
		},
		spawnGradleCommand
	)
	.command(
		commands.runBuildToolWithSingleGrammarFileSupport,
		"Run the build tool with a single grammar file",
		config => {
			return config.demandOption(PARAM_SET.runBuildToolWithSingleGrammarFileSupport);
		},
		spawnGradleCommand
	)
	.demandCommand(1, "You have to specify at least 1 command")
	.option(paramKeys.ANTLR_SRC, {
		alias: "s",
		description: "Path to Antlr source files",
		type: "string"
	})
	.option(paramKeys.LANGUAGE, {
		alias: "n",
		description: "Language name",
		type: "string"
	})
	.option(paramKeys.TARGET_DIR, {
		alias: "t",
		description: "Target to copy the result to",
		type: "string"
	})
	.option(paramKeys.LEXER_NAME, {
		alias: "l",
		description: "Lexer name",
		type: "string"
	})
	.option(paramKeys.PARSER_NAME, {
		alias: "p",
		description: "Parser name",
		type: "string"
	})
	.option(paramKeys.GRAMMAR_FILE, {
		alias: "g",
		description: "Name of the grammar file",
		type: "string"
	})
	.option(paramKeys.BASE_LEXER_NAME, {
		alias: "bl",
		description: "Name of the Base Lexer file",
		type: "string"
	})
	.option(paramKeys.BASE_PARSER_NAME, {
		alias: "bp",
		description: "Name of the Base Parser file",
		type: "string"
	})
	.option(paramKeys.INIT_SCRIPT, {
		alias: "I",
		description: "Init script for Gradle",
		type: "string"
	})
	.option(paramKeys.GRADLE_WRAPPER_PATH, {
		description: "Gradle wrapper execution path which contains gradlew and gradlew.bat",
		type: "string"
	})
	.parserConfiguration({
		"strip-aliased": true,
		"camel-case-expansion": false
	})
	.group(PARAM_SET.baseParams, "Required in all cases options:")
	.group(PARAM_SET.runBuildTool, "Required options when building with Lexer and Parser files:")
	.group(
		PARAM_SET.runBuildToolWithBaseClassesSupport,
		"Required options when " + "building with BaseLexer and BaseParser files:"
	)
	.group(PARAM_SET.runBuildToolWithSingleGrammarFileSupport, "Required option when building with single grammar file")
	.demandOption(PARAM_SET.baseParams)
	.config()
	.strict()
	.help()
	.alias("help", "h").argv;
