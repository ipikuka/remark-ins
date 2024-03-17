import dedent from "dedent";

import { process } from "./util/index";

describe("no options - fail", () => {
  // ******************************************
  it("bad usage", async () => {
    const input = dedent`
      ++inserted text with bad wrapped+

      +inserted text with bad wrapped++

      + +inserted text with bad wrapped++

      ++ inserted text with unwanted space++

      ++inserted text with unwanted space ++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p>++inserted text with bad wrapped+</p>
      <p>+inserted text with bad wrapped++</p>
      <ul>
        <li>+inserted text with bad wrapped++</li>
      </ul>
      <p>++ inserted text with unwanted space++</p>
      <p>++inserted text with unwanted space ++</p>
      "
    `);
  });
});

describe("no options - success", () => {
  // ******************************************
  it.skip("empty inserted texts", async () => {
    const input = dedent(`
      ++++

      ++  ++

      a++ ++a
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins-empty"></ins></p>
      <p><ins class="remark-ins-empty"></ins></p>
      <p>a<ins class="remark-ins-empty"></ins>a</p>
      "
    `);
  });

  // ******************************************
  it("standart usage", async () => {
    const input = dedent(`
      ++inserted++ ++another inserted++ 
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
      ++inserted++ with extra content ++ could not inserted++ 

      ++inserted++ **with extra boldcontent** ++another could not inserted ++ 
    `);

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins">inserted</ins> with extra content ++ could not inserted++</p>
      <p><ins class="remark-ins">inserted</ins> <strong>with extra boldcontent</strong> ++another could not inserted ++</p>
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

  // ******************************************
  it("nested ins don't work, arbitrary inserted texts are considered right", async () => {
    const input = dedent`
      ++outer ++inner++ inserted++

      ++inserted++inner++inserted++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins">outer ++inner</ins> inserted++</p>
      <p><ins class="remark-ins">inserted</ins>inner<ins class="remark-ins">inserted</ins></p>
      "
    `);
  });

  // ******************************************
  it("works if contains other phrasing contents", async () => {
    const input = dedent`
      ++**xxx++_yyy_++zzz**++

      ++Google is [++another inserted++](https://www.google.com) in inserted++
    `;

    expect(await process(input)).toMatchInlineSnapshot(`
      "
      <p><ins class="remark-ins"><strong>xxx<ins class="remark-ins"><em>yyy</em></ins>zzz</strong></ins></p>
      <p><ins class="remark-ins">Google is <a href="https://www.google.com"><ins class="remark-ins">another inserted</ins></a> in inserted</ins></p>
      "
    `);
  });
});
