import express from 'express';
import db from './models';
import route from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import formData from 'express-form-data';
import os from 'os';

const app: express.Application = express()
const port = process.env.PORT || '5000';

app.use(express.json())
app.use(express.urlencoded({extended: true }))

app.use(cors())
app.use(cookieParser())

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };

app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use("/api/v1", route)

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.info(`running on port:${port}`)
    })
})

