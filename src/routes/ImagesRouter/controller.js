export default class ImageController {
  async create(req, res, next) {}
  async find(req, res, next) {}
  async get(req, res, next) {
    const { filepath } = req.params;

    if (!filepath) {
      next(new Error("Missing filename"));
      return;
    }

    res.sendFile(filepath, err => {
      if (err) next(err);
      else console.log("file sent");
    });
  }
  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(req, res, next) {}
}
