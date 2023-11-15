import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()

// Configuration 
cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET
});

export { cloudinary }