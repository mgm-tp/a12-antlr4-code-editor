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

import fs from "fs-extra";
import gitlog from "gitlog";

const antlrCodeEditorVersion = process.env.PROJECT_VERSION || process.env.npm_package_version;

/**
 * Get N latest git commits (not include merge commits).
 * By getting N + buffer then filter out merge ones.
 * Note: We are filter commits which not change file.
 * Please don't set option includeMergeCommitFiles to true.
 * @param {*} numberOfLatestCommits
 * @returns array of commits include their hash and message
 */
const getLatestGitCommits = async (numberOfLatestCommits = 5) => {
	return await gitlog({
		repo: path.resolve(import.meta.dirname, "..", ".."),
		number: numberOfLatestCommits,
		fields: ["subject", "abbrevHash"],
		nameStatus: false,
		/**
		 * Because `gitlog` doesn't support `--no-merges` option, so we use the `branch` option to pass it into the `git log` command
		 */
		branch: "--no-merges"
	});
};

const writeBuildInfo = async () => {
	fs.writeJSONSync(
		"./resources/html/info.json",
		{
			buildNumber: process.env.BUILD_NUMBER,
			version: antlrCodeEditorVersion,
			latestGitCommits: await getLatestGitCommits(),
			buildTime: new Date()
		},
		{
			spaces: 4,
			replacer: null
		}
	);
};

await writeBuildInfo();
