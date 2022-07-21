export const promisifier = async (
  promise: any
): Promise<[any | null, string | null]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
