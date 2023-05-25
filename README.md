# Fookbake-Api 📗

## Project building
1. Design Figma
2. Config Backend
3. 

## Build Fookbake-api

### Install pnpm (New package manager)
```
npm i -g pnpm  
pnpm init 
pnpm add express
pnpm add dotenv
pnpm add cors
pnpm add -D morgan  // D คือ devdepancies ที่ใช้ตอน dev
pnpm add helmet
pnpm add express-rate-limit
```
### Add .gitignore
touch .gitignore

### Creat Folder and file 

/src/app.js

### add script to package.json

```
 "scripts": {
    "dev": "nodemon src/app.js"
  },
```

### Test run with

pnpm dev

### config server

##### .env

```
NODE_ENV=develop      // test/production
PORT=8888
```

##### middlewares/not-found.js

```
module.exports =(req, res) => {
    res.status(404).json({ message: 'resource not found on this server'})
}
```

##### TEST GET localhost:8000


{
  "message": "resource not found on this server"
}


##### middlewares/error.js
```
module.exports =(err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: err.message});
}
```


##### app.js

```
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const notFoundMiddleware = require('./middlewares/not-found')
const errorMiddleware = require ('./middlewares/error')

const app = express();



//External Middleware ที่ต้องใช้

// Mogan เช็ค Header log
if(process.env.NODE_ENV === 'develop') {
    app.use(morgan('combined'))   // morgan('combined')  morgan('dev')  check more https://www.npmjs.com/package/morgan
}


//จำกัดการ request
app.use(rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 1000,
    message: { message : 'too many requests'}
})
)


app.use(helmet())  // set response Header ให้ อัตโนมัติ
app.use(cors());
app.use(express.json());  // แปลง String ที่อยู่ใน format json ให้เป็นรูปแบบ Obj



//Internal Middleware
app.use(errorMiddleware)
app.use(notFoundMiddleware)


const port = process.env.PORT || 8000
app.listen(port, () =>
console.log('Server running on port' + port))

````

## Design Database

```
fookbakeDB.dio

```


### Install  Database Library

pnpm add mysql2 
pnpm add sequelize

### Restructure sequelize  for read all config .env

create
.sequelizerc

```
const path = require('path')

module.exports = {
    config: path.resolve('src/config', 'database.js'),
    'models-path': path.resolve('src', 'models')
}
```
Then run

sequelize init:config

Will get

📦src
 ┣ 📂config
 ┃ ┗ 📜database.js



*จากเดิม คือใช้ config.json วิธีนี้จะทำให้อ่านค่า config ได้จาก .env แทน โดย อ่านผ่าน database.js


##### config DB to .env

```
DB_USERNAME=root
DB_PASSWORD=passw0rd
DB_NAME=cc14_fakebuck
DB_HOST=localhost
```

##### add require .env and module.exports    to  database.js
```
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
```

Create DB with sequelize db:create

Result below
```
Loaded configuration file "src/config/database.js".
Using environment "development".
Database cc14_fakebuck created.
```

/usr/local/mysql/bin/mysql -u root -p 
```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| cc14_fakebuck      |
+--------------------+
```

Create models with sequelize init:models
```
📦models
 ┗ 📜index.js

 ```
Create user.js

```
📦models
 ┣ 📜index.js
 ┗ 📜user.js
 ```