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

import { useDispatch } from "react-redux";
import { type JSX } from "react";

import { FrameFactories, FrameViews, LocaleActions } from "@com.mgmtp.a12.client/client-core";
import { HeaderTrigger, Icon, List, PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core";

import { useLocalizer } from "../localization/index.js";
import { BuildInformation } from "../components/BuildInformation/index.js";

function A12AntlrCodeEditorFrameComponent(props: FrameViews.ApplicationFrameLayoutProps): JSX.Element {
	return (
		<FrameViews.ApplicationFrameLayout
			{...props}
			additionalHeaderItems={[
				{
					item: (
						<PopUpMenu triggerElement={<HeaderTrigger graphic={"language"}></HeaderTrigger>}>
							<List>
								<LanguageSwitcher />
							</List>
						</PopUpMenu>
					),
					orientation: "rightSlots-left"
				},
				{
					item: <BuildInformation />,
					orientation: "rightSlots-left"
				}
			]}
		/>
	);
}

export const customLayoutProvider: FrameViews.LayoutProvider = (name: string) => {
	return name === "ApplicationFrame"
		? { component: A12AntlrCodeEditorFrameComponent, visibleViews: "multiple" }
		: FrameFactories.layoutProvider(name);
};

function LanguageSwitcher(): JSX.Element {
	const locale = localStorage.getItem("locale") || "en_US";
	const dispatch = useDispatch();
	const localizer = useLocalizer();

	return (
		<>
			<List.SubHeader fill>{localizer("antlrCodeEditor.languagePicking")}</List.SubHeader>
			<List.Item
				text={"English"}
				meta={locale === "en_US" && <Icon>check</Icon>}
				onClick={() => {
					dispatch(LocaleActions.set({ language: "en", country: "US" }));
				}}
			/>
			<List.Item
				text={"Deutsch"}
				meta={locale === "de_DE" && <Icon>check</Icon>}
				onClick={() => {
					dispatch(LocaleActions.set({ language: "de", country: "DE" }));
				}}
			/>
		</>
	);
}
