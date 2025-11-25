import { ArtistEntity } from "./individual/ArtistEntity";
import { DocumentsEntity } from "./individual/DocumentsEntity";

export type ArtistWithDocumentsEntity = ArtistEntity & {
    documents: DocumentsEntity[];
  };