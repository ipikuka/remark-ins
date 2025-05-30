import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { process } from "./util/index";

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

  // ******************************************
  it("works if it contains other phrasing contents like **strong**", async () => {
    const input = dedent`
      foo++**a++b**++bar

      foo ++**a++b**++ bar

      ++foo **a++b** bar++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>foo<ins class="remark-ins"><strong>a++b</strong></ins>bar</p>
      <p>foo <ins class="remark-ins"><strong>a++b</strong></ins> bar</p>
      <p><ins class="remark-ins">foo <strong>a++b</strong> bar</ins></p>
      "
    `);
  });

  // ******************************************
  it("works if contains other phrasing contents", async () => {
    const input = dedent`
      open++**strong ++_italik inserted_++ inserted**++close

      ++open**strong ++_italik inserted_++ inserted**close++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>open<ins class="remark-ins"><strong>strong <ins class="remark-ins"><em>italik inserted</em></ins> inserted</strong></ins>close</p>
      <p><ins class="remark-ins">open<strong>strong <ins class="remark-ins"><em>italik inserted</em></ins> inserted</strong>close</ins></p>
      "
    `);
  });
});
