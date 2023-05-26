require('dotenv').config();
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoute = require('./routes/auth-route')

const notFoundMiddleware = require('./middlewares/not-found')
const errorMiddleware = require ('./middlewares/error')

const app = express();



//External Middleware ที่ต้องใช้

// Mogan เช็ค Header log
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'))   // morgan('combined')  morgan('dev')  check more https://www.npmjs.com/package/morgan
}


//จำกัดการ request
app.use(rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 10,
    message: { message : 'too many requests 😠'}
})
)


app.use(helmet())  // set response Header ให้ อัตโนมัติ
app.use(cors());
app.use(express.json());  // แปลง String ที่อยู่ใน format json ให้เป็นรูปแบบ Obj


app.use('/auth', authRoute);



//Internal Middleware
app.use(errorMiddleware)
app.use(notFoundMiddleware)


const port = process.env.PORT || 8000
app.listen(port, () =>
console.log('Server running on port' + port))