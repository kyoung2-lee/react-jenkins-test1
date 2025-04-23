declare module "exif-js" {
  interface EXIFStatic {
    getData(url: string | HTMLImageElement, callback: unknown): unknown;
    getTag(img: unknown, tag: unknown): unknown;
    getAllTags(img: unknown): unknown;
    pretty(img: unknown): string;
    readFromBinaryFile(file: unknown): unknown;
  }

  declare let EXIF: EXIFStatic;
  export = EXIF;
}
