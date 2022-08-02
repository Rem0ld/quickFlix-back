export const promisifier = async <T>(promise: any): Promise<[T, string]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
