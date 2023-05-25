# Fookbake

## Project building
1. Design Figma
2. Config Backend
3. 

## Build Fookbake-api

### Install pnpm (New package manager)

npm i -g pnpm 
pnpm init 
pnpm add express
pnpm add dotenv
pnpm add cors
pnpm add -D morgan  // D คือ devdepancies ที่ใช้ตอน dev
pnpm add helmet
pnpm add express-rate-limit

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