import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import type { VFileCompatible, Value } from "vfile";

import plugin from "../../src";

const compiler = unified()
  .use(remarkParse)
  .use(gfm)
  .use(plugin)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);

export const process = async (contents: VFileCompatible): Promise<Value> => {
  return compiler.process(contents).then((file) => file.value);
};
