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

/**
 * This script is used to correct the import paths of the antlr4 library (Copied from A12 Expression).
 * It should be fixed from the antlr4 library itself.
 * @See https://github.com/antlr/antlr4/issues/4218
 */

import Path from "node:path";
import Fs from "node:fs/promises";

import { globIterate } from "glob";
import { Project } from "ts-morph";

import { getPath } from "./utils.js";

const nodeModulesDir = await getPath(process.argv[2]);

console.log(`Patching antlr package under node_modules directory: ${nodeModulesDir}`);

const project = new Project();

for await (const entry of globIterate(`${Path.join(nodeModulesDir, "antlr4", "src/antlr4")}/**/*.d.ts`)) {
	project.addSourceFileAtPath(entry);
}

for (const sourceFile of project.getSourceFiles()) {
	const filePath = sourceFile.getFilePath();
	console.log();

	console.log(`=== Migrating file ${filePath} ===`);

	for (const importDecl of sourceFile.getImportDeclarations()) {
		const specifier = importDecl.getModuleSpecifierValue();
		console.log();

		console.log(`Migrating import: ${specifier}`);

		const migratedSpecifier = await migrateImport({ specifier, filePath });

		if (migratedSpecifier !== specifier) {
			console.log(`Migrated import:  ${migratedSpecifier}`);
			importDecl.setModuleSpecifier(migratedSpecifier);
		}
	}

	for (const exportDecl of sourceFile.getExportDeclarations()) {
		const specifier = exportDecl.getModuleSpecifierValue();

		if (!specifier) {
			continue;
		}

		console.log(`Migrating ${specifier}`);
		const migratedSpecifier = await migrateImport({ specifier, filePath });
		console.log(`\nCurrent: ${specifier}\nMigrate: ${migratedSpecifier}\n\n`);
		exportDecl.setModuleSpecifier(migratedSpecifier);
	}
}

await project.save();

async function migrateImport(context) {
	const { specifier, filePath } = context;
	const baseFilePath = Path.resolve(Path.dirname(filePath), specifier);

	if (specifier.endsWith(".js")) {
		return specifier;
	}

	const checkingFilePath = Path.join(baseFilePath + ".d.ts");
	console.info("Checking file: " + checkingFilePath);

	if (await checkFile(checkingFilePath)) {
		console.info("Found file: " + checkingFilePath);

		return specifier + ".js";
	}

	const indexFilePath = Path.join(baseFilePath, "index.d.ts");
	console.info("Checking file: " + indexFilePath);

	if (await checkFile(indexFilePath)) {
		console.info("Found file: " + indexFilePath);

		return specifier + "/index.js";
	}

	throw new Error(`Cannot migrate ${specifier} in ${filePath}`);
}

async function checkFile(path) {
	try {
		const stats = await Fs.stat(path);

		return stats.isFile();
	} catch {
		return false;
	}
}
