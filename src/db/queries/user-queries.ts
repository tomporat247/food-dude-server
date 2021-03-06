import { User, UserDocument, UserSearchProperties } from '../../models/user';
import { UserModel } from '../schemas/user-schema';
import { FilterQuery } from 'mongoose';
import { isNil, omitBy } from 'lodash';
import { getCaseInsensitiveContainsFieldFilterQuery } from './utils/common-query-utils';
import { Address } from '../../types/address';
import { getUserIdsWithReviews } from './review-queries';

export const doesUserExist = (id: string) => UserModel.exists({ _id: id });

export const getAllUsers = () => UserModel.find();

export const createUser = (user: User) => UserModel.create(user);

export const findUserByEmailAndPassword = (email: string, passwordHash: string) =>
  UserModel.findOne({ email, passwordHash });

export const findUserById = (id: string) => UserModel.findById(id);

export const findAndUpdateUser = (id: string, update: Partial<User>) =>
  UserModel.findByIdAndUpdate(id, { $set: update }, { new: true });

export const findUsersForSearch = async (
  properties: UserSearchProperties & { address?: Address },
  connectedUserIds?: string[]
) => {
  const relevantUserIds: string[] = [];
  if (properties.currentlyLoggedIn) {
    relevantUserIds.push(...connectedUserIds);
  }
  if (properties.contributor) {
    const contributorUserIds = await getUserIdsWithReviews();
    relevantUserIds.push(...contributorUserIds);
  }

  const filterQuery: FilterQuery<UserDocument> = {
    _id: relevantUserIds.length > 0 ? { $in: relevantUserIds } : undefined,
    firstName: getCaseInsensitiveContainsFieldFilterQuery(properties.firstName),
    lastName: getCaseInsensitiveContainsFieldFilterQuery(properties.lastName),
    email: getCaseInsensitiveContainsFieldFilterQuery(properties.email),
    role: properties.role || undefined,
    'address.area': properties?.address?.area || undefined,
    'address.city': getCaseInsensitiveContainsFieldFilterQuery(properties?.address?.city),
    'address.street': getCaseInsensitiveContainsFieldFilterQuery(properties?.address?.street),
    'address.houseNumber': +properties?.address?.houseNumber || undefined
  };
  return UserModel.find(omitBy(filterQuery, isNil));
};
