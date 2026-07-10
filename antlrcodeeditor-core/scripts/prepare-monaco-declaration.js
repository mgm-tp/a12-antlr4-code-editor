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

import Fs from "node:fs/promises";
import Path from "node:path";

import ts from "typescript";

import { getPath } from "./utils.js";

const __dirname = import.meta.dirname;
const inputFilePath = Path.join(await getPath(process.argv[2]), "monaco-editor", "/esm/vs/editor/editor.api.d.ts");
const outputFilePath = Path.resolve(__dirname, "..", "src", "internal", "types", "monaco.ts");

// Create a program from the input file
const program = ts.createProgram([inputFilePath], {});
const sourceFile = program.getSourceFile(inputFilePath);

// Collect exported members from the source file
const checker = program.getTypeChecker();
const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);
const exportedSymbols = checker.getExportsOfModule(sourceFileSymbol);

// Separate type-only symbols from value symbols for verbatimModuleSyntax compatibility
const typeOnlyMembers = [];
const valueMembers = [];
for (const symbol of exportedSymbols) {
	const name = symbol.getName();
	if (symbol.flags & ts.SymbolFlags.Value) {
		valueMembers.push(name);
	} else {
		typeOnlyMembers.push(name);
	}
}
const allMembers = [...typeOnlyMembers, ...valueMembers];

// Create the output file content
Path.relative(Path.dirname(outputFilePath), inputFilePath);

const importTypeSection =
	typeOnlyMembers.length > 0 ? `import type {\n\t${typeOnlyMembers.join(",\n\t")}\n} from "monaco-editor";\n` : "";
const importValueSection =
	valueMembers.length > 0 ? `import {\n\t${valueMembers.join(",\n\t")}\n} from "monaco-editor";\n` : "";

/**
 * Print the output file which imports and re-exports the content of `monaco-editor` to a namespace
 */
const outputContent = `/*
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

/**
 * This file is auto-generated to fix the problem in the issue https://github.com/microsoft/monaco-editor/issues/4049
 * where the monaco type declaration got conflict.
 * @generated
 */
${importTypeSection}${importValueSection}
declare global {
\tnamespace monaco {
\t\texport {
\t\t\t${allMembers.join(",\n\t\t\t")}
\t\t};
\t}
}
`;

// Write the output file
await Fs.writeFile(outputFilePath, outputContent);

console.log(`Generated ${outputFilePath} successfully!`);
