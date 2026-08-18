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
import { pathToFileURL } from "node:url";

import { globSync } from "glob";

import versionFile from "./versions.json" with { type: "json" };

const shouldUpgradePeers = process.argv.includes("--upgrade-peers");

const rootDir = path.resolve(import.meta.dirname, "..");

const packageJsonFiles = globSync("**/package.json", {
	ignore: ["**/node_modules/**"],
	cwd: rootDir,
	absolute: true
});

for (const filePath of packageJsonFiles) {
	// Use file path as a File URL to fix issue on Windows
	const packageJsonPath = pathToFileURL(filePath).href;
	const { default: packageJson } = await import(packageJsonPath, {
		with: { type: "json" }
	});
	const dependencies = packageJson.dependencies || {};
	const devDependencies = packageJson.devDependencies || {};
	const peerDependencies = packageJson.peerDependencies || {};

	const calculateSemver = (oldVersion, newVersion) => {
		if (oldVersion.startsWith("^") || oldVersion.startsWith("~")) {
			return oldVersion.charAt(0) + newVersion.replace(/^([\^~])/, "");
		}

		return newVersion;
	};

	const setVersion = (dependencyName, dependencyList) => {
		const [namespace] = dependencyName.split("/");
		const oldVersion = dependencyList[dependencyName];

		if (!versionFile.versions[namespace]) {
			return;
		}

		let newVersion;

		if (versionFile.exceptions?.[dependencyName]) {
			newVersion = calculateSemver(oldVersion, versionFile.exceptions[dependencyName]);
		} else {
			newVersion = calculateSemver(oldVersion, versionFile.versions[namespace]);
		}

		dependencyList[dependencyName] = newVersion;
	};

	Object.keys(dependencies).forEach(dependencyName => setVersion(dependencyName, dependencies));

	Object.keys(devDependencies).forEach(dependencyName => setVersion(dependencyName, devDependencies));

	if (shouldUpgradePeers) {
		Object.keys(peerDependencies).forEach(dependencyName => setVersion(dependencyName, peerDependencies));
	}

	fs.writeFileSync(filePath, JSON.stringify(packageJson, null, "\t") + "\n", "utf-8");
}
