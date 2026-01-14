export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error Handler:', err);
  console.error('Error stack:', err.stack);
  console.error('Error details:', {
    message: err.message,
    code: err.code,
    name: err.name,
    statusCode: err.statusCode,
  });

  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Provide more helpful error messages for common issues
  if (err.code === 'P1001') {
    message = 'Database connection error. Please check your DATABASE_URL in .env file.';
  } else if (err.code === 'P2025') {
    message = 'Database tables not found. Please run: npx prisma migrate dev';
  } else if (err.message?.includes('Cloudinary')) {
    message = 'Cloudinary error: ' + err.message;
  } else if (err.message?.includes('Invalid file type')) {
    message = err.message;
  } else if (err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('File too large')) {
    message = 'הקובץ גדול מדי. הגודל המקסימלי הוא 200MB. אנא נסו קובץ קטן יותר או דחוסו את הקובץ.';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      code: err.code,
      name: err.name,
    }),
  });
};
