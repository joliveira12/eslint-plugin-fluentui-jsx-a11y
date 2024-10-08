"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const jsx_ast_utils_1 = require("jsx-ast-utils");
const labelUtils_1 = require("../util/labelUtils");
const hasNonEmptyProp_1 = require("../util/hasNonEmptyProp");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const rule = utils_1.ESLintUtils.RuleCreator.withoutDocs({
    defaultOptions: [],
    meta: {
        // possible error messages for the rule
        messages: {
            missingLabelOrAriaLabeledByInDropdown: "Accessibility: Dropdown mising label or missing aria-labelledby"
        },
        // "problem" means the rule is identifying code that either will cause an error or may cause a confusing behavior: https://eslint.org/docs/latest/developer-guide/working-with-rules
        type: "problem",
        // docs for the rule
        docs: {
            description: "Accessibility: Dropdown menu must have an id and it needs to be linked via htmlFor of a Label",
            recommended: "strict"
        },
        schema: []
    },
    // create (function) returns an object with methods that ESLint calls to “visit” nodes while traversing the abstract syntax tree
    create(context) {
        return {
            // visitor functions for different types of nodes
            JSXOpeningElement(node) {
                // if it is not a Dropdown, return
                if ((0, jsx_ast_utils_1.elementType)(node) !== "Dropdown") {
                    return;
                }
                // if the dropdown has a aria-LabeledBy with same value present in id of Label, return (Most recommended)
                // if the dropdown has an id and a label with htmlFor with sanme value as id, return
                // if the dropdown has an associated label, return
                // if the dropdown is inside Label tag, return
                if ((0, labelUtils_1.hasAssociatedLabelViaHtmlFor)(node, context) ||
                    (0, labelUtils_1.hasAssociatedLabelViaAriaLabelledBy)(node, context) ||
                    (0, hasNonEmptyProp_1.hasNonEmptyProp)(node.attributes, "aria-label") ||
                    (0, labelUtils_1.isInsideLabelTag)(context)) {
                    return;
                }
                // if it has no visual labelling, report error
                context.report({
                    node,
                    messageId: `missingLabelOrAriaLabeledByInDropdown`
                });
            }
        };
    }
});
exports.default = rule;
