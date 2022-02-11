export default class Server {
  #http;

  constructor(http) {
    this.#http = http;
  }

  middlewares = (middlewares) => {
    for (const middleware in middlewares) {
      this.#http.use(middlewares[middleware]);
    }
  };

  routes = (routes) => {
    for (const route in routes) {
      console.log(`Route: ${route} active`)
      routes[route].stack.forEach(layer => {
        console.log(`  ${Object.keys(layer.route.methods)[0].toLocaleUpperCase()} ${layer.route.path}`)
      })
      console.log('================')
      this.#http.use(route, routes[route]);
    }
  };

  errorHandler = (errorHandler) => {
    this.#http.use(errorHandler);
  };

  start = (port) => {
    this.#http.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  };
}
