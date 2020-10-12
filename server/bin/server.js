const env = process.env.NODE_ENV || "development";

if (env) {
    require("dotenv").config({ path: process.cwd() + '/.env'});
}

const app = require('../index');
const http = require("http");
const port = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});