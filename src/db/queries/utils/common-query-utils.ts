import { getCaseInsensitiveContainsRegExp } from '../../../utils/common-utils';

export const getCaseInsensitiveContainsFieldFilterQuery = (value: any) =>
  value ? { $regex: getCaseInsensitiveContainsRegExp(value) } : undefined;
