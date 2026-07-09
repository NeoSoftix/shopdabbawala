export const getPagination = (req) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  page = isNaN(page) || page < 1 ? 1 : page;
  limit = isNaN(limit) || limit < 1 ? 10 : limit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};