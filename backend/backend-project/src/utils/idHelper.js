/**
 * Helper to generate the next sequential numeric ID for any Mongoose Model.
 */
const getNextId = async (Model) => {
  const lastDoc = await Model.findOne().sort({ id: -1 }).select('id');
  if (lastDoc && typeof lastDoc.id === 'number') {
    return lastDoc.id + 1;
  }
  return 1;
};

/**
 * Builds a flexible MongoDB filter to match by either ObjectId or numeric/string id.
 */
const buildIdFilter = (id) => {
  if (id === undefined || id === null) {
    return { _id: null };
  }

  const strId = String(id).trim();
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(strId);
  const numId = Number(strId);

  const conditions = [];

  if (isObjectId) {
    conditions.push({ _id: strId });
  }

  if (!isNaN(numId)) {
    conditions.push({ id: numId });
  }

  conditions.push({ id: strId });

  return conditions.length === 1 ? conditions[0] : { $or: conditions };
};

module.exports = {
  getNextId,
  buildIdFilter
};
