declare var window: Window & typeof globalThis;
declare var document: Document;

interface Response {
  code: number
  data: any
  message: string
  success: boolean
}
