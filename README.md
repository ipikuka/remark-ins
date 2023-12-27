# remark-ins

[![NPM version][npm-image]][npm-url]
[![Build][github-build]][github-build-url]
![npm-typescript]
[![License][github-license]][github-license-url]

This package is a [unified][unified] ([remark][remark]) plugin to add ins element (compatible with new parser "[micromark][micromark]").

"**unified**" is a project that transforms content with abstract syntax trees (ASTs). "**remark**" adds support for markdown to unified. "**mdast**" is the markdown abstract syntax tree (AST) that remark uses.

**This plugin is a remark plugin that transforms the mdast.**

## When should I use this?

This plugin is useful if you want to **add a \<ins\> element** in markdown, which represents a range of text that has been added to a document. **You can easily create \<ins\> element with the `remark-ins`.**

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

**use `++`** for the syntax

#### ++inserted content++

Say we have the following file, `example.md`, which consists some flexible markers.

```markdown
++This text has been inserted++
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
<p><ins class="remark-ins">This text has been inserted</ins></p>
```

Without `remark-ins`, you’d get:

```html
<p>++This text has been inserted++</p>
```

## Options

There is no option for the `remark-ins`.

## Example:

```markdown
Here is ~~deleted content~~ and ++inserted content++

Here is **++bold and inserted content++**

### Heading with ++inserted content++
```
is going to produce as default:

```html
<p>Here is <del>deleted content</del> and <ins class="remark-ins">inserted content</ins></p>
<p>Here is <strong><ins class="remark-ins">bold and inserted content</ins></strong></p>
<h3>Heading with <ins class="remark-ins">inserted content</ins></h3>
```

You can use the ins syntax in the tables, headings, lists, blockquotes etc. For detailed examples, you can have a look at the test files in the github repo.

## Syntax tree

This plugin only modifies the mdast (markdown abstract syntax tree) as explained.

## Types

This package is fully typed with [TypeScript][typeScript].

## Compatibility

This plugin works with unified version 6+ and remark version 7+. It is compatible with mdx version.2.

## Security

Use of `remark-ins` does not involve rehype (hast) or user content so there are no openings for cross-site scripting (XSS) attacks.

## My Remark Plugins

The remark packages I have published are presented below:
+ [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
+ [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
+ [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
+ [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
+ [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown

## License

[MIT][license] © ipikuka

### Keywords

[unified][unifiednpm] [remark][remarknpm] [remark-plugin][remarkpluginnpm] [mdast][mdastnpm] [markdown][markdownnpm] [remark ins][remarkInsnpm] [remark inserted text][remarkInsertedTextnpm] [remark ins element][remarkInsElementnpm]

[unified]: https://github.com/unifiedjs/unified
[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remark]: https://github.com/remarkjs/remark
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[mdast]: https://github.com/syntax-tree/mdast
[mdastnpm]: https://www.npmjs.com/search?q=keywords:mdast
[micromark]: https://github.com/micromark/micromark
[typescript]: https://www.typescriptlang.org/
[license]: https://github.com/ipikuka/remark-ins/blob/main/LICENSE
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[remarkInsnpm]: https://www.npmjs.com/search?q=keywords:remark%20ins
[remarkInsertedTextnpm]: https://www.npmjs.com/search?q=keywords:remark%20inserted%20text
[remarkInsElementnpm]: https://www.npmjs.com/search?q=keywords:remark%20ins%20element
[npm-url]: https://www.npmjs.com/package/remark-ins
[npm-image]: https://img.shields.io/npm/v/remark-ins
[github-license]: https://img.shields.io/github/license/ipikuka/remark-ins
[github-license-url]: https://github.com/ipikuka/remark-ins/blob/master/LICENSE
[github-build]: https://github.com/ipikuka/remark-ins/actions/workflows/publish.yml/badge.svg
[github-build-url]: https://github.com/ipikuka/remark-ins/actions/workflows/publish.yml
[npm-typescript]: https://img.shields.io/npm/types/remark-ins
