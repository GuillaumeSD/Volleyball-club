import { Element, Document } from "parse5/dist/tree-adapters/default";

export type CustomDom = Omit<Document, "childNodes"> & {
  childNodes: CustomNode[];
};

export type CustomNode = Omit<Element, "childNodes"> & {
  childNodes: CustomNode[];
  value: string;
};
