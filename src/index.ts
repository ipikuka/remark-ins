import { visit, type Visitor, type VisitorResult } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Paragraph, Root, Text } from "mdast";
import { u } from "unist-builder";

export const REGEX = /\+\+\s*([^+]*[^ ])?\s*\+\+/;
export const REGEX_GLOBAL = /\+\+\s*([^+]*[^ ])?\s*\+\+/g;

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
   * constracts the custom <ins> node
   *
   */
  const constructInsNode = (insertedText: string | undefined): Paragraph => {
    // https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes
    return {
      type: "paragraph",
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
  const visitor: Visitor<Text> = function (node, index, parent): VisitorResult {
    if (!parent) return;

    if (!REGEX.test(node.value)) return;

    const children: Array<Text | Paragraph> = [];
    const value = node.value;
    let tempValue = "";
    let prevMatchIndex = 0;
    let prevMatchLength = 0;

    const matches = Array.from(value.matchAll(REGEX_GLOBAL));

    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];

      const mIndex = match.index ?? 0;
      const mLength = match[0].length; // match[0] is the matched input

      // could be a text part before each matched part
      const textPartIndex = index === 0 ? 0 : prevMatchIndex + prevMatchLength;

      prevMatchIndex = mIndex;
      prevMatchLength = mLength;

      // if there is a text part before
      if (mIndex > textPartIndex) {
        const textValue = value.substring(textPartIndex, mIndex);

        const textNode = u("text", textValue) as Text;
        children.push(textNode);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [input, insertedText] = match;

      const inserterNode = constructInsNode(insertedText);

      children.push(inserterNode);

      // control for the last text node if exists after the last match
      tempValue = value.slice(mIndex + mLength);
    }

    // if there is still text after the last match
    if (tempValue) {
      const textNode = u("text", tempValue) as Text;
      children.push(textNode);
    }

    if (children.length) parent.children.splice(index!, 1, ...children);
  };

  const transformer: Transformer<Root> = (tree) => {
    visit(tree, "text", visitor);
  };

  return transformer;
};

export default plugin;
