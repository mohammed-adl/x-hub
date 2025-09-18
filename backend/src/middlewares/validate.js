import { ZodError } from "zod";

export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      const parsedBody = schemas.body.parse(req.body);
      req.body = parsedBody;
    }
    if (schemas.params) {
      const parsedParams = schemas.params.parse(req.params);
      req.params = parsedParams;
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.flatten().fieldErrors,
      });
    }
    next(err);
  }
};
