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

import { useContext, useMemo } from "react";

import { SizeContext, type SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";

const breakpoints = ["xs", "sm", "md", "lg"];
export type ScreenSize = Exclude<SizeDetectorProps.Size, null>;

/**
 * Return if the current screen size is below the provided breakpoint.
 * This useBelowBreakpoint hook are used for custom Notification Center components. For other purposes, use it at your own risk.
 */
export const useBelowBreakpoint = (breakpoint: ScreenSize) => {
	const { currentSize } = useContext(SizeContext);

	return useMemo(() => {
		if (!breakpoint || !currentSize) {
			return false;
		}
		return breakpoints.indexOf(currentSize) <= breakpoints.indexOf(breakpoint);
	}, [breakpoint, currentSize]);
};

/**
 * Return if the current screen size exceeds the provided breakpoint.
 * This useExceedBreakpoint hook are used for custom Notification Center components. For other purposes, use it at your own risk.
 */
export const useExceedBreakpoint = (breakpoint: ScreenSize): boolean => {
	const { currentSize } = useContext(SizeContext);

	return useMemo(() => {
		if (!breakpoint || !currentSize) {
			return false;
		}
		return breakpoints.indexOf(currentSize) >= breakpoints.indexOf(breakpoint);
	}, [breakpoint, currentSize]);
};
