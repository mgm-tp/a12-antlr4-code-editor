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

import { useDispatch, useSelector } from "react-redux";
import { JSX } from "react";

import {
	Config,
	DefaultFormModelMap,
	DefaultWidgetMap,
	DispatchConfiguration,
	FormModelMap,
	WidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core/lib/view/index.js";
import { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { IAntlrProps } from "@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-core";
import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core/lib/models/index.js";
import { Styleable } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/index.js";
import { TextAreaStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-area/main/template/text-area.tpl.api.js";
import {
	FormEngineActions,
	FormEngineStateAdapter,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core/lib/client-extensions/index.js";

import { FormControlContext, useFormModelMapContext } from "./FormControlContext.js";
import CodeEditorControl from "./CodeEditorControl.js";

export type ExtendedConfig = Config & IAntlrProps;

export const CustomFormModelMap: FormModelMap = {
	...DefaultFormModelMap,
	Control: {
		component: function CustomControl(props: FormModelMap.FormModelComponentProps<FormModel.Control>) {
			return (
				<FormControlContext.Provider value={{ ...props }}>
					<DefaultFormModelMap.Control.component {...props} />
				</FormControlContext.Provider>
			);
		}
	}
};

export const CustomWidgetsMap: WidgetMap = {
	...DefaultWidgetMap,
	TextAreaStateless(props: TextAreaStatelessProps) {
		const { modelElement } = useFormModelMapContext();
		if (modelElement.annotations && modelElement.annotations[0].name === "CodeEditor") {
			return <CodeEditorControl {...props} />;
		}

		return <DefaultWidgetMap.TextAreaStateless {...props}></DefaultWidgetMap.TextAreaStateless>;
	}
};

type EventHandlers = {
	eventHandlers?: Partial<DispatchConfiguration>;
};

export type DefaultProps = View & FormEngineViews.FormEngineProps & EventHandlers & Styleable & IAntlrProps;

function useDefaultProps(props: FormEngineViews.FormEngineProps) {
	const dispatch = useDispatch();
	const stateProps = useSelector(state => FormEngineStateAdapter.mapStateToProps(state, props));
	const dispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);
	return {
		...props,
		...stateProps,
		...dispatchProps
	};
}

export function DefaultCustomFormEngineView(props: DefaultProps): JSX.Element | null {
	const defaultProps = useDefaultProps(props);

	if (defaultProps.config === undefined || defaultProps.state === undefined) {
		return null;
	}

	const customConfig: ExtendedConfig = {
		...defaultProps.config,
		formModelMap: CustomFormModelMap,
		widgetMap: CustomWidgetsMap,
		antlrConfig: {
			...props.antlrConfig
		}
	};

	return <FormEngineViews.FormEngineTpl {...defaultProps} config={customConfig} />;
}
