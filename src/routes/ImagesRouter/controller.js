import path from "path";
export default class ImageController {
  async create(req, res, next) {}
  async find(req, res, next) {}
  async get(req, res, next) {
    const options = {
      root: path.resolve("./public"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    const { filepath } = req.params;

    console.log(filepath);

    if (!filepath) {
      next(new Error("Missing filename"));
      return;
    }

    res.sendFile(`images/${filepath}`, options, err => {
      if (err) next(err);
    });
  }
  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(req, res, next) {}
}
