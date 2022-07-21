export const promisifier = async (promise: any) => {
  try {
    const result = await promise();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
