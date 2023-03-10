import { unified, type Processor } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import dedent from "dedent";
import type { VFileCompatible } from "vfile";

import plugin from "../src";

const compiler: Processor = unified()
  .use(remarkParse)
  .use(gfm)
  .use(plugin)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);

const process = async (contents: VFileCompatible): Promise<VFileCompatible> => {
  return compiler.process(contents).then((file) => file.value);
};

describe("within a markdown content", () => {
  // ******************************************
  it("works in different markdown elements", async () => {
    const input = dedent`
      # heading with ++inserted++

      + ++inserted++ in a list item
      + list item with ++inserted++

      |Abc|Xyz|
      |---|---|
      |normal|++inserted++|

      Here are *++italic inserted++* and **++bold inserted++**

      > Here is ++inserted++ in blockquote
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <h1>heading with <ins class="remark-ins">inserted</ins></h1>
      <ul>
        <li><ins class="remark-ins">inserted</ins> in a list item</li>
        <li>list item with <ins class="remark-ins">inserted</ins></li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Abc</th>
            <th>Xyz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>normal</td>
            <td><ins class="remark-ins">inserted</ins></td>
          </tr>
        </tbody>
      </table>
      <p>Here are <em><ins class="remark-ins">italic inserted</ins></em> and <strong><ins class="remark-ins">bold inserted</ins></strong></p>
      <blockquote>
        <p>Here is <ins class="remark-ins">inserted</ins> in blockquote</p>
      </blockquote>
      "
    `);
  });
});
