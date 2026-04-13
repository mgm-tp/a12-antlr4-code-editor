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
 * 1. Open-Source License – EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { ComponentType } from "react";

import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { CRUDViews } from "@com.mgmtp.a12.crud/crud-core";
import { IAntlrConfig, ISuggestion } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";

import { DefaultCustomFormEngineView } from "../modules/defaultCustomFormEngineView/DefaultCustomFormEngineView.js";
import { ScssLexer, ScssParser, theme } from "../config/grammar/index.js";
import { store } from "../index.js";

export function createViewProvider(): View.Provider {
	const enginesViewProvider = createEnginesViewProvider();

	function chainedViewComponentProvider(componentName: string): ComponentType<View> {
		return enginesViewProvider(componentName) || FrameFactories.viewProvider(componentName);
	}

	return ModuleRegistryProvider.getViewProvider(store.getState(), chainedViewComponentProvider);
}

function createEnginesViewProvider(): (componentName: string) => ComponentType<View> | undefined {
	const getSuggestions = (): Promise<ISuggestion[]> => fetch("./suggestions.json").then(response => response.json());

	const components: { [name: string]: ComponentType<View> | undefined } = {
		FormEngine(props) {
			return <CRUDViews.FormEngineView {...props} />;
		},
		CustomFormEngine(props) {
			const configObject: IAntlrConfig = {
				lexer: ScssLexer,
				parser: ScssParser,
				theme,
				getSuggestions,
				rootRuleName: "stylesheet",
				uiConfig: {
					height: "196px"
				}
			};

			return <DefaultCustomFormEngineView {...props} antlrConfig={configObject} />;
		}
	};

	return name => {
		return components[name];
	};
}
