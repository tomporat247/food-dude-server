import { Document } from 'mongoose';
import { omit } from 'lodash';

export const getDocumentWithoutIrrelevantFields = (document: Document, fieldsToRemove: string[] = []): object =>
  omit(document.toObject(), fieldsToRemove);
