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

import { type Middleware } from "redux";

import {
	createDefaultMiddlewareOptions,
	createFormEngineMiddlewares,
	formEngineDataReducers,
	formEngineSagas,
	FormModelProcessor,
	platformAttachmentLoader
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	ApplicationActions,
	ApplicationFactories,
	ApplicationModel,
	type ApplicationSetup,
	type ComposeEnhancer,
	LocaleActions,
	StoreFactories
} from "@com.mgmtp.a12.client/client-core";
import { type ICustomCondition } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import {
	getCodeEditorErrors,
	getValidationState,
	ValidationStatus
} from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";
import { createHttpModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import { RtCustomExtensionService } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";

import { codeEditorDataLoader } from "./loaders/codeEditorDataLoader.js";
import model from "./appmodel.json" with { type: "json" };
import { isProduction } from "./config/index.js";

export function setup(): ApplicationSetup {
	/**
	 * Custom condition which is used for code editor
	 *
	 * Conditions:
	 * - CodeEditorCondition: Execute the full validate of against the Antlr grammar
	 * - ProjectConditionWarning, ProjectConditionError : The custom condition for demonstrate the combination of CodeEditor error and project validator
	 */
	const conditionsMap: Record<string, ICustomCondition> = {
		CodeEditorCondition: {
			check(data, relevantEntities, formallyIncorrectFields, errorField) {
				const fieldContent = data.getValue(errorField);
				if (fieldContent) {
					const errors = getCodeEditorErrors("example");
					return errors.length > 0;
				}

				return false;
			}
		},
		CodeEditorPendingValidation: {
			check(data, relevantEntities, formallyIncorrectFields, errorField) {
				const fieldContent = data.getValue(errorField);
				if (fieldContent) {
					const pendingValidations = getValidationState({
						owner: "example",
						status: ValidationStatus.CHECKING
					});
					return pendingValidations.length > 0;
				}

				return false;
			}
		},
		ProjectConditionWarning: {
			check(data, relevantEntities, formallyIncorrectFields, errorField) {
				const fieldContent = data.getValue(errorField);
				if (fieldContent) {
					const regex = ".*warning.*";
					return new RegExp(regex, "m").test(fieldContent);
				}

				return false;
			}
		},
		ProjectConditionError: {
			check(data, relevantEntities, formallyIncorrectFields, errorField) {
				const fieldContent = data.getValue(errorField);
				if (fieldContent) {
					const regex = ".*error.*";
					return new RegExp(regex, "m").test(fieldContent);
				}

				return false;
			}
		}
	};

	RtCustomExtensionService.registerCustomConditions({
		createCustomCondition(name: string) {
			return conditionsMap[name];
		}
	});

	return ApplicationFactories.createApplicationSetup({
		model: model as ApplicationModel,
		modelLoader: createHttpModelLoader({
			modelProcessors: [FormModelProcessor]
		}),
		dataHandlers: [codeEditorDataLoader],
		customSagas: [...formEngineSagas({ attachmentLoader: platformAttachmentLoader })],
		additionalMiddlewares: [
			...createFormEngineMiddlewares({
				...createDefaultMiddlewareOptions()
			}),
			devToolMiddleware()
		],
		setupActions: [
			LocaleActions.set({ language: "en", country: "US" }),
			ApplicationActions.startMainActivityRequested({
				descriptor: {
					model: "sample_code_editor",
					instance: "SampleFormModel/1"
				}
			})
		],
		dataReducers: formEngineDataReducers,
		composeEnhancer: isProduction ? undefined : enableReduxDevTools()
	});
}

declare let window: Window & {
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: ComposeEnhancer;
	_sampleDevToolMiddleware?: Middleware;
};

/**
 * Trick to enable Redux DevTools with TS: see https://www.npmjs.com/package/redux-ts
 */
function enableReduxDevTools(): ComposeEnhancer | undefined {
	return typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		: undefined;
}

/**
 * Enable A12 Client Chrome Extension
 */
const devToolMiddleware = (): Middleware => {
	return window._sampleDevToolMiddleware === undefined
		? (window._sampleDevToolMiddleware = StoreFactories.createMiddleware((api, next, action) => {
				const retVal = next(action);
				return retVal;
			}))
		: window._sampleDevToolMiddleware;
};
