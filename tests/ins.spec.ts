import dedent from "dedent";

import { process } from "./util/index";

describe("no options - fail", () => {
  // ******************************************
  it("bad usage", async () => {
    const input = dedent`
      ++marked text with bad wrapped+

      +marked text with bad wrapped++

      + +marked text with bad wrapped++

      ++**strong text in ins, instead of inserted text in strong**++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>++marked text with bad wrapped+</p>
      <p>+marked text with bad wrapped++</p>
      <ul>
        <li>+marked text with bad wrapped++</li>
      </ul>
      <p>++<strong>strong text in ins, instead of inserted text in strong</strong>++</p>
      "
    `);
  });
});

describe("no options - success", () => {
  // ******************************************
  it("empty inserted text", async () => {
    const input = dedent(`
      ++++

      ++  ++

      Here **empty** ++++ inserted text within a content
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins-empty"></ins></p>
      <p><ins class="remark-ins-empty"></ins></p>
      <p>Here <strong>empty</strong> <ins class="remark-ins-empty"></ins>inserted text within a content</p>
      "
    `);
  });

  // ******************************************
  it("standart usage", async () => {
    const input = dedent(`
      ++inserted++ ++  another inserted  ++ 
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins">inserted</ins> <ins class="remark-ins">another inserted</ins></p>
      "
    `);
  });

  // ******************************************
  it("inserted text in a strong", async () => {
    const input = dedent(`      
        **++bold inserted++**

        here is **++bold inserted++**

        **++bold inserted++** is here

        **strong ++bold inserted++**
      `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><strong><ins class="remark-ins">bold inserted</ins></strong></p>
      <p>here is <strong><ins class="remark-ins">bold inserted</ins></strong></p>
      <p><strong><ins class="remark-ins">bold inserted</ins></strong> is here</p>
      <p><strong>strong <ins class="remark-ins">bold inserted</ins></strong></p>
      "
    `);
  });

  // ******************************************
  it("standart usage with extra content", async () => {
    const input = dedent(`      
      ++inserted++ with extra content ++  other inserted  ++ 

      ++inserted++ **with extra boldcontent** ++  another inserted   ++ 
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins">inserted</ins> with extra content <ins class="remark-ins">other inserted</ins></p>
      <p><ins class="remark-ins">inserted</ins> <strong>with extra boldcontent</strong> <ins class="remark-ins">another inserted</ins></p>
      "
    `);
  });

  // ******************************************
  it("example in README", async () => {
    const input = dedent(`      
      Here is ~~deleted content~~ and ++inserted content++

      Here is **++bold and inserted content++**
      
      ### Heading with ++inserted content++
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>Here is <del>deleted content</del> and <ins class="remark-ins">inserted content</ins></p>
      <p>Here is <strong><ins class="remark-ins">bold and inserted content</ins></strong></p>
      <h3>Heading with <ins class="remark-ins">inserted content</ins></h3>
      "
    `);
  });
});
