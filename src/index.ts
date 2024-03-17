import { visit, type Visitor, type VisitorResult } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Data, Parent, PhrasingContent, Root, Text } from "mdast";
import { u } from "unist-builder";

interface InsertData extends Data {}

interface Insert extends Parent {
  /**
   * Node type of mdast Insert.
   */
  type: "insert";
  /**
   * Children of paragraph.
   */
  children: PhrasingContent[];
  /**
   * Data associated with the mdast paragraph.
   */
  data?: InsertData | undefined;
}

declare module "mdast" {
  interface PhrasingContentMap {
    insert: Insert;
  }

  interface RootContentMap {
    insert: Insert;
  }
}

// the previous regex was not strict related with spaces
// export const REGEX = /\+\+\s*([^+]*[^ ])?\s*\+\+/;
// export const REGEX_GLOBAL = /\+\+\s*([^+]*[^ ])?\s*\+\+/g;

// the new regex is strict!
// it doesn't allow a space after the first double equity sign
// it doesn't allow a space before the last double equity sign
export const REGEX = /\+\+(?![\s+])([\s\S]*?)(?<![\s+])\+\+/;
export const REGEX_GLOBAL = /\+\+(?![\s+])([\s\S]*?)(?<![\s+])\+\+/g;

/**
 *
 * This plugin turns ++text++ into a <ins>text</ins>
 *
 * for example:
 *
 * Here is ++inserted text++
 *
 */
export const plugin: Plugin<void[], Root> = () => {
  /**
   *
   * constructs a custom <ins> node
   *
   */
  const constructInsNode = (insertedText: string | undefined): Insert => {
    // https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes
    return {
      type: "insert",
      children: [{ type: "text", value: insertedText ?? "" }],
      data: {
        hName: "ins",
        hProperties: {
          className: insertedText ? ["remark-ins"] : ["remark-ins-empty"],
        },
      },
    };
  };

  /**
   *
   * visits the text nodes which match with the ins syntax (++insertedtext++)
   *
   */
  const visitor: Visitor<Text, Parent> = function (node, index, parent): VisitorResult {
    /* istanbul ignore next */
    if (!parent || typeof index === "undefined") return;

    if (!REGEX.test(node.value)) return;

    const children: Array<PhrasingContent> = [];
    const value = node.value;
    let tempValue = "";
    let prevMatchIndex = 0;
    let prevMatchLength = 0;

    const matches = Array.from(value.matchAll(REGEX_GLOBAL));

    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];

      const [matched, insertedText] = match;
      const mIndex = match.index!;
      const mLength = matched.length;

      // could be a text part before each matched part
      const textPartIndex = index === 0 ? 0 : prevMatchIndex + prevMatchLength;

      prevMatchIndex = mIndex;
      prevMatchLength = mLength;

      // if there is a text part before
      if (mIndex > textPartIndex) {
        const textValue = value.substring(textPartIndex, mIndex);

        const textNode = u("text", textValue);
        children.push(textNode);
      }

      const insertNode = constructInsNode(insertedText);

      children.push(insertNode);

      // control for the last text node if exists after the last match
      tempValue = value.slice(mIndex + mLength);
    }

    // if there is still text after the last match
    if (tempValue) {
      const textNode = u("text", tempValue);
      children.push(textNode);
    }

    if (children.length) parent.children.splice(index, 1, ...children);
  };

  const transformer: Transformer<Root> = (tree) => {
    visit(tree, "text", visitor);
  };

  return transformer;
};

export default plugin;
