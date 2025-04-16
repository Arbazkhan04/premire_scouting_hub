const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { createHash } = require('crypto');
require('dotenv').config();


console.log("Access key is accessilble",process.env.AWS_ACCESS_KEY)
console.log("AWS_REGION is accessilble",process.env.AWS_REGION)
console.log("AWS_SECRET_KEY is accessilble",process.env.AWS_SECRET_KEY)



// Setup S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Helpers
const getHashedFileName = (fileName) => {
  const hash = createHash('md5');
  hash.update(fileName);
  return hash.digest('hex');
};

const getFileExtension = (mimeType) => {
  const mimeTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  };
  return mimeTypes[mimeType] || 'bin';
};

// Main Middleware Generator
const s3UploadMiddleware = (folderNames = [], filePrefixes = [], uniqueField = 'userId') => {
  const s3Storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueValue = req.body[uniqueField] || req.user?.[uniqueField];
      const hash = getHashedFileName(file.originalname);
      const ext = getFileExtension(file.mimetype);

      const index = filePrefixes.indexOf(file.fieldname);
      const folder = folderNames[index] || 'default';

      const key = `${folder}/${file.fieldname}/${uniqueValue}/${Date.now()}_${hash}.${ext}`;
      cb(null, key);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!filePrefixes.includes(file.fieldname)) {
      return cb(
        new Error(`Invalid file field. Allowed fields: ${filePrefixes.join(', ')}`),
        false
      );
    }
    cb(null, true);
  };

  const fields = filePrefixes.map((field) => ({ name: field, maxCount: 1 }));
  return multer({ storage: s3Storage, fileFilter }).fields(fields);
//   return multer({ storage: s3Storage, fileFilter }).any(); 
};

module.exports = s3UploadMiddleware;
