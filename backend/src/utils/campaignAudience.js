import User from '../models/User.model.js';
import Vendor from '../models/vendor.model.js';
import Subscription from '../models/Subcription.model.js';

// Resolves a campaign's `filters` object into the list of target users.
// filters: { role, isActive, city, packageId, userIds, search }
//
// `isActive` means different things per role: for customers it's a field on
// User itself, but a vendor's active status lives on their Vendor profile
// (Vendor.isActive), not on the User document - so it's resolved via a
// lookup instead of a direct query field.
export const resolveCampaignAudience = async (filters = {}) => {
  if (filters.userIds?.length) {
    return User.find({ _id: { $in: filters.userIds } });
  }

  const role = filters.role || 'user';
  const query = { role };

  // Collects userId lists from lookups (Vendor, Subscription) that must all
  // match - intersected together instead of overwriting each other.
  let idConstraint = null;
  const intersect = (ids) => {
    const idSet = new Set(ids.map((id) => id.toString()));
    idConstraint = idConstraint
      ? idConstraint.filter((id) => idSet.has(id.toString()))
      : ids;
  };

  if (filters.isActive !== undefined) {
    if (role === 'vendor') {
      const vendorUserIds = await Vendor.find({ isActive: filters.isActive }).distinct('userId');
      intersect(vendorUserIds);
    } else {
      query.isActive = filters.isActive;
    }
  }

  if (filters.city) {
    query.city = { $regex: filters.city, $options: 'i' };
  }

  if (filters.packageId) {
    const subscriberIds = await Subscription.find({ package: filters.packageId }).distinct('user');
    intersect(subscriberIds);
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
      { phone: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (idConstraint) {
    query._id = { $in: idConstraint };
  }

  return User.find(query);
};
