require('dotenv').config();
const serverSocket = require('./src/server');
const PORT = process.env.PORT || 3000;
const { conn } = require('./src/db');


conn.sync({force: false}).then(() => {
  serverSocket.listen(PORT, () => {
    console.log(`Sever listening on http://localhost:${PORT}`);
  });
});
