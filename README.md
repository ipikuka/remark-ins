# remark-ins

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/remark-ins/graph/badge.svg?token=G4IHZFTC8A)](https://codecov.io/gh/ipikuka/remark-ins)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fremark-ins%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/remark-ins)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([remark][remark]) plugin to add `<ins>` element in markdown.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add a `<ins>` element** in markdown, which represents a range of text that has been added to a document.

**You can easily create `<ins>` element with the `remark-ins`.**

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install remark-ins
```

or

```bash
yarn add remark-ins
```

## Usage

#### use `++` around the content

Say we have the following file, `example.md`, which consists some flexible markers.

```markdown
++inserted text++
```

And our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkIns from "remark-ins";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkIns)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` yields:\

```html
<p><ins class="remark-ins">inserted text</ins></p>
```

Without `remark-ins`, you’d get:

```html
<p>++inserted text++</p>
```

> [!CAUTION]
> **The double plus signs must be adjacent to the content**.\
> **The content must be wrapped with double plus signs, not singular at any side.**\

Here are some bad usage, and will not work.

```markdown
++text with bad wrapped+

+text with bad wrapped++

++ text with unwanted space++

++text with unwanted space ++
```

## It is more flexible and powerful

As of version `^1.1.0`, the `remark-ins` can handle also the syntax containing other markdown phrases like `strong`, `emphasis`, `link` etc. For example:

```
++**inserted bold content**++

++_inserted italic content_++

++[inserted link](https://google.com)++
```

```html
<p>
  <ins class="remark-ins">
    <strong>inserted bold content</strong>
  </ins>
</p>
<p>
  <ins class="remark-ins">
    <em>inserted italic content</em>
  </ins>
</p>
<p>
  <ins class="remark-ins">
    <a href="https://google.com">inserted link</a>
  </ins>
</p>
```

## Options

There is no option for the `remark-ins`.

## Example:

```markdown
~~deleted content~~ and ++inserted content++

**++inserted bold content++** and ++**inserted bold content**++

### Heading with ++inserted content++
```
is going to produce as default:

```html
<p>
  <del>deleted content</del>
   and 
  <ins class="remark-ins">inserted content</ins>
</p>
<p>
  <strong><ins class="remark-ins">inserted bold content</ins></strong>
   and 
  <ins class="remark-ins"><strong>inserted bold content</strong></ins>
</p>
<h3>Heading with <ins class="remark-ins">inserted content</ins></h3>
```

You can use the ins syntax in the tables, headings, lists, blockquotes etc. For detailed examples, you can have a look at the test files in the github repo.

## Syntax tree

This plugin only modifies the mdast (markdown abstract syntax tree) as explained.

## Types

This package is fully typed with [TypeScript][typescript].

## Compatibility

This plugin works with `unified` version 6+ and `remark` version 7+. It is compatible with `mdx` version 2+.

## Security

Use of `remark-ins` does not involve rehype (hast) or user content so there are no openings for cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via Vfile.data or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [remark][remarknpm] 🟩 [remark plugin][remarkpluginnpm] 🟩 [mdast][mdastnpm] [markdown][markdownnpm] 🟩 [remark ins][remarkinsnpm] 🟩 [remark inserted text][remarkinsertedtextnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[mdastnpm]: https://www.npmjs.com/search?q=keywords:mdast
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[remarkinsnpm]: https://www.npmjs.com/search?q=keywords:remark%20ins
[remarkinsertedtextnpm]: https://www.npmjs.com/search?q=keywords:remark%20inserted%20text

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/

[badge-npm-version]: https://img.shields.io/npm/v/remark-ins
[badge-npm-download]:https://img.shields.io/npm/dt/remark-ins
[npm-package-url]: https://www.npmjs.com/package/remark-ins

[badge-license]: https://img.shields.io/github/license/ipikuka/remark-ins
[github-license-url]: https://github.com/ipikuka/remark-ins/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/remark-ins/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/remark-ins/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/remark-ins
[typescript-url]: https://www.typescriptlang.org/
