require('dotenv').config();
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoute = require('./routes/auth-route')
const userRoute = require('./routes/user-route')

const notFoundMiddleware = require('./middlewares/not-found')
const errorMiddleware = require ('./middlewares/error')

const app = express();

app.use(cors());

//External Middleware ที่ต้องใช้

// Mogan เช็ค Header log
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'))   // morgan('combined')  morgan('dev')  check more https://www.npmjs.com/package/morgan
}


//จำกัดการ request
app.use(rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 1000,
    message: { message : 'too many requests 😠'}
})
)

app.use(cors());
app.use(helmet())  // set response Header ให้ อัตโนมัติ

app.use(express.json());  // แปลง String ที่อยู่ใน format json ให้เป็นรูปแบบ Obj
//app.use(express.urlencoded({ extended: false }))  การใช้ app.use ลักษณะนี้ ใช้กับ พวก เว็บแบบ Moonolit


app.use('/auth', authRoute);
app.use('/users', userRoute);


//Internal Middleware
app.use(errorMiddleware)
app.use(notFoundMiddleware)


const port = process.env.PORT || 8000
app.listen(port, () =>
console.log('Server running on port' + port))