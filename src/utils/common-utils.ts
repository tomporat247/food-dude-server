import { Document } from 'mongoose';
import { omit } from 'lodash';

export const getDocumentWithoutIrrelevantFields = (document: Document, fieldsToRemove: string[] = []): object =>
  omit(document.toObject ? document.toObject() : document, fieldsToRemove);

export const getCaseInsensitiveContainsRegExp = (value: any) => new RegExp(`^.*${value}.*`, 'i');
