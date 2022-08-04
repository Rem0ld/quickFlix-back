export const promisifier = async <T>(promise: any): Promise<[T, any]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
