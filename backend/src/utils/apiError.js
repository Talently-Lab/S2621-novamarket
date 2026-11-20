export const sendError = (res, status, code, message, fields) => {
  const error = { code, message };

  if (fields) {
    error.fields = fields;
  }

  return res.status(status).json({ error });
};
