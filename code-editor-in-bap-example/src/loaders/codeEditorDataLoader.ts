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

import { Activity, ActivityMap, DataLoader } from "@com.mgmtp.a12.client/client-core";
import { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { type Model } from "@com.mgmtp.a12.base/base-model-api";

type Data = Activity.Data.Document;

export const codeEditorDataLoader: DataLoader<Data> = {
	name: "codeEditorDataLoader",
	canHandle(activityDescriptor: Activity.Descriptor, parents?: ActivityMap): boolean {
		return activityDescriptor.model === "sample_code_editor" && activityDescriptor.instance === "SampleFormModel/1";
	},
	async load(activity: Activity, models: Promise<DataLoader.Models>): Promise<Data> {
		const { documentModel } = await models;

		if (documentModel === undefined) {
			return Promise.reject("No suitable document model was provided!");
		}

		return {
			id: "SampleFormModel/1",
			modelId: documentModel.header.id,
			document: {
				NormalControls: {
					Name: "Sample name",
					Description: "Sample description"
				},
				ControlWithCodeEditor: {
					CodeEditor: [
						"@media only screen and (max-width: 1000px) {",
						"\t.supply-name {",
						"\t\tbackground-color: #ccc;",
						"\t\tborder: 2px solid black;",
						"\t}",
						"}",
						"",
						"div > h2 {",
						"\tfont-size: 4em;",
						"\tfont-family: Ampersand, Helvetica, sans-serif;",
						"}",
						"",
						"@font-face {",
						"\tfont-family: 'Ampersand';",
						"\tsrc: local('Times New Roman');",
						"\tunicode-range: U+26;",
						"}",
						""
					].join("\n")
				}
			}
		};
	},
	async save(
		activityDescriptor: Activity.Descriptor,
		data: Data,
		documentModel: DocumentModel | undefined,
		modelsInScene: Model[]
	): Promise<Data> {
		if (!activityDescriptor.instance) {
			return Promise.reject("Missing instance information in activity descriptor");
		}

		if (!data.document) {
			return Promise.reject("Document not found!");
		}

		return Promise.resolve(data);
	},
	delete(
		activityDescriptor: Activity.Descriptor,
		data: object,
		documentModel: DocumentModel | undefined,
		modelsInScene: Model[]
	): Promise<void> {
		return Promise.reject("Delete operation is not supported.");
	}
};
