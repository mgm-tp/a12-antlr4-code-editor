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

import { IValidationState } from "../types/ValidationState.js";

let validationState: IValidationState[] = [];

/**
 * Get all validation tasks from Code editor. You can filter the result by owner, validationType and status
 *
 * @param filter - The filter options
 */
export const getValidationState = (filter?: Partial<IValidationState>): IValidationState[] => {
	return filter
		? validationState.filter(
				state =>
					(!filter.owner || (filter.owner && state.owner === filter.owner)) &&
					(!filter.validationType ||
						(filter.validationType && state.validationType === filter.validationType)) &&
					(!filter.status || filter.status === state.status)
			)
		: validationState;
};

/**
 * Set a new state into the validation state of Code editor. At the point of time, there's only one state of one model
 * and validation type.
 * New state will be added to the end of the validation states
 *
 * @param newState - To be added state
 */
export const setValidationState = (newState: IValidationState): void => {
	const currentStatus = validationState.filter(
		state => !(state.owner === newState.owner && state.validationType === newState.validationType)
	);
	validationState = currentStatus.concat(newState);
};
