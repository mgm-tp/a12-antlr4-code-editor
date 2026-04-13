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

import { useContext } from "react";

import {
	DataFormats,
	Locale,
	LocalizableArgs,
	localizableFromLocalizationTreeMap,
	LocalizationTreeMap,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { en_US } from "./resources/en_US.js";
import { de_DE } from "./resources/de_DE.js";

export { RESOURCE_KEYS } from "./keys.js";

/**
 * Export L10Context for class based components
 */
export interface L10nContext {
	readonly dataFormats: DataFormats;
	readonly locale: Locale;
	readonly localizer: Localizer;
}

export const supportedLocales = [Locale.fromString("en_US"), Locale.fromString("de_DE")];

export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = {
	en: en_US,
	de: de_DE
};

/**
 * Apply default translations to the Localizer and return new Localizer function,
 * which expects only localization key instead of the whole localizable object.
 */
export const applyDefaultTranslations = (localizer: Localizer) => {
	return (key: string, args?: LocalizableArgs) =>
		localizer(localizableFromLocalizationTreeMap(key, DEFAULT_TRANSLATIONS, args)) ?? "";
};

/**
 * Localizer hook, which returns Localizer with applied default translations.
 */
export const useLocalizer = () => {
	const { localizer } = useContext(LocalizerContext);

	return applyDefaultTranslations(localizer);
};
