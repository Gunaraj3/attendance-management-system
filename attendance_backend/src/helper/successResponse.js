export let successResponse = ({ res, message, result = [], statusCode }) => {
  res.status(statusCode).json({
    success: true,
    message,
    result,
  });
};
