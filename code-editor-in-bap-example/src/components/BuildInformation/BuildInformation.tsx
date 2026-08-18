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

import { Fragment, JSX, useEffect, useRef, useState } from "react";
import gitLog from "gitlog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

import { TextOutput } from "@com.mgmtp.a12.widgets/widgets-core/lib/text-output/index.js";
import { Typography } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/index.js";
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core/lib/bullet-list/index.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/index.js";
import { HeaderTrigger } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { ConnectedToast } from "@com.mgmtp.a12.widgets/widgets-core/lib/toast/index.js";

import { useExceedBreakpoint } from "../../utils/use-screen-breakpoint.js";

dayjs.extend(relativeTime);
const { Item, Unordered } = BulletList;
const INFINITE_TOAST_DURATION = 86400000;

/**
 * Build Information data fetch from info.json.
 */
interface IBuildInformation {
	buildNumber: string;
	version?: string;
	buildTime?: Date;
	latestGitCommits?: ReturnType<typeof gitLog>[];
}

export const BuildInformation = (): JSX.Element => {
	const [showBuildInfo, setShowBuildInfo] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [buildInfo, setBuildInfo] = useState<IBuildInformation | undefined>(undefined);
	const buttonRef = useRef<HTMLElement | null>(null);
	const shouldRenderDetails = useExceedBreakpoint("lg");

	const getJsonFile = async (url: string): Promise<void> => {
		try {
			const response = await fetch(url);
			const gitlogData = await response.json();
			setBuildInfo(gitlogData);
			setError(null);
		} catch (error) {
			console.log("Error: ", error);
			setError("Cannot get build information from info.json file");
		}
	};

	useEffect(() => {
		getJsonFile("info.json");
	}, []);

	if (!buildInfo) {
		return <></>;
	}

	const { version, buildNumber, buildTime, latestGitCommits } = buildInfo;

	const renderBuildInfoContent = (): JSX.Element | null => {
		if (!buttonRef.current || !buildInfo || !showBuildInfo) {
			return null;
		}

		return (
			<ConnectedToast
				onClose={() => setShowBuildInfo(false)}
				referenceElement={buttonRef.current}
				message={
					<Typography.Section>
						<Typography.Headline level={5} divider>
							Build info
						</Typography.Headline>
						<Typography.Body data-testid="last-build-time">
							<p>
								<b>Version:</b> {version}
							</p>
							<p>
								<b>Last build time:</b> {dayjs(buildTime).fromNow()}
							</p>
						</Typography.Body>
						{buildNumber && (
							<Typography.Body data-testid="build-number">
								<b>Build number:</b> {buildNumber}
							</Typography.Body>
						)}
						{latestGitCommits?.length ? (
							<>
								<TextOutput label="Latest commits:" />
								<Unordered>
									{latestGitCommits.map(({ abbrevHash, subject }) => (
										<Item key={abbrevHash}>
											<b>{subject}</b>
											<span> [{abbrevHash}]</span>
										</Item>
									))}
								</Unordered>
							</>
						) : null}
					</Typography.Section>
				}
				duration={INFINITE_TOAST_DURATION}
			/>
		);
	};

	const getVersionTitle = (): string => {
		const version = buildInfo?.version ? "V" + buildInfo.version : "";
		const buildDate = buildInfo?.buildTime ? " - " + dayjs(buildInfo.buildTime).fromNow() : "";
		return error ? "Cannot get build information" : version + buildDate;
	};

	return (
		<>
			<HeaderTrigger
				className={addPrefix("-u-flex", "-u-flex-wrap")}
				onClick={() => setShowBuildInfo(true)}
				buttonRef={ref => {
					buttonRef.current = ref;
				}}
				graphic={"info"}
			>
				{shouldRenderDetails && (
					<Fragment>
						<span>{getVersionTitle()}</span>
						<Icon>arrow_drop_down</Icon>
					</Fragment>
				)}
			</HeaderTrigger>
			{renderBuildInfoContent()}
		</>
	);
};
