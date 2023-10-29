export interface DocumentToSet<T = Record<string, unknown>> {
  firestorePath: string;
  data: T;
}
