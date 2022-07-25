export default class baseDTO<T> {
  constructor() { }
  serialize() {
    const result: Partial<this> = {};
    const parsed = JSON.parse(JSON.stringify(this));
    for (let el in parsed) {
      if (this[el] !== null) {
        result[el] = this[el];
      }
    }
    return result;
  }

  deserialize() {
    return this
  }
}
