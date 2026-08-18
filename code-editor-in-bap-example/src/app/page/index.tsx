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

import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { JSX, ReactElement, useMemo } from "react";

import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { FrameFactories } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base/index.js";
import { SizeContext, useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/index.js";
import { View, ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ProgressIndicator } from "@com.mgmtp.a12.widgets/widgets-core/lib/progress-indicator/index.js";
import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/should-forward-prop.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { appTheme } from "../../theme/index.js";
import { DEFAULT_TRANSLATIONS } from "../../localization/index.js";

import { createViewProvider } from "../containerFactory.js";
import { customLayoutProvider } from "../layoutProvider.js";

const BasePage = (): JSX.Element | null => {
	const rootRegionRef = useMemo(() => [], []);
	const RegionUi = useMemo(() => FrameFactories.regionUiProvider(rootRegionRef), [rootRegionRef]);
	const viewProvider = useMemo(() => createViewProvider(), []);

	return (
		<RegionUi
			regionReference={rootRegionRef}
			layoutProvider={customLayoutProvider}
			regionUiProvider={FrameFactories.regionUiProvider}
			viewProvider={viewProvider}
			progressComponentProvider={progressComponentProvider}
		/>
	);
};

const Page = (): JSX.Element => {
	const locale = useSelector(LocaleSelectors.locale());
	const dataFormats = defaultDataFormats(locale);
	const conversion = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale,
		conversion,
		dataFormats,
		translationSource: DEFAULT_TRANSLATIONS
	});

	return (
		<LocalizerContext.Provider value={{ locale, dataFormats, localizer, conversion }}>
			<A11YLanguageContext.Provider value={getA11yResource(locale.language)}>
				<BasePage />
			</A11YLanguageContext.Provider>
		</LocalizerContext.Provider>
	);
};

export const ResizeablePage = (): JSX.Element => {
	const { breakPoint } = useWindowSize();

	return (
		<SizeContext.Provider value={{ currentSize: breakPoint.size }}>
			<Page />
		</SizeContext.Provider>
	);
};

/**
 * Page with global styles and default theme applied.
 *
 * Other available themes can be found in the Widgets documentation.
 */
export const StyledPage = (): JSX.Element => {
	return (
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<ThemeProvider theme={appTheme}>
				<GlobalStyles />
				<ResizeablePage />
			</ThemeProvider>
		</StyleSheetManager>
	);
};

const progressComponentProvider = createProgressComponentProvider(500);

export function createProgressComponentProvider(delay?: number): View.ProgressComponentProvider {
	function ProgressComponent({
		activityId,
		children
	}: View.ProgressComponentProvider.PropsType): ReactElement | null {
		const loading = useSelector(ActivitySelectors.busy(activityId));

		return (
			<ViewViews.ProgressIndicator
				style={{ height: "100%", width: "100%" }}
				delay={delay}
				progress={loading ? "loading" : "none"}
				ProgressIndicatorComponent={props => (
					<ProgressIndicator {...props} focusOnOpen id="progress-indicator" />
				)}
			>
				{children}
			</ViewViews.ProgressIndicator>
		);
	}

	return function ProgressComponentProvider() {
		return ProgressComponent;
	};
}
