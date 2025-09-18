import AppError from "../utils/AppError.js";

export const success = (res, data, status = 200) => {
  return res.status(status).json(data);
};

export const fail = (message, status = 500) => {
  throw new AppError(message, status);
};
