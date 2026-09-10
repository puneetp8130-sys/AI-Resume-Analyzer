const multer = require('multer');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new AppError('Please upload a valid PDF resume.', 400, 'INVALID_FILE_TYPE'));
      return;
    }
    cb(null, true);
  },
});

function handleResumeUpload(req, res, next) {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError(`Resume file is too large. Max size is ${env.maxUploadSizeMb}MB.`, 400, 'FILE_TOO_LARGE')
        );
      }
      return next(new AppError('Failed to process the uploaded file.', 400, 'UPLOAD_FAILED'));
    }
    if (err) return next(err);

    if (!req.file) {
      return next(new AppError('Please select a PDF resume to upload.', 400, 'NO_FILE_PROVIDED'));
    }

    return next();
  });
}

module.exports = { handleResumeUpload };
