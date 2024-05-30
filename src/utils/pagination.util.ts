export function paginate(
  items: any[],
  options: { page: number; limit: number },
) {
  const { page, limit } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return items.slice(startIndex, endIndex);
}
