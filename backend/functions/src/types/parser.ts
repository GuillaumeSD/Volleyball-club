import { Document, Element } from "parse5/dist/tree-adapters/default";

export type CustomDom = Document & {
  childNodes: CustomNode[];
};

export type CustomNode = Element & {
  childNodes: CustomNode[];
  value: string;
};
