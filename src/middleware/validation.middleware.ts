import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodType<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (req.body && Object.keys(req.body).length > 0) {
        await schema.parseAsync(req.body);
      }

      // Validate request query
      if (req.query && Object.keys(req.query).length > 0) {
        await schema.parseAsync(req.query);
      }

      // Validate request params
      if (req.params && Object.keys(req.params).length > 0) {
        await schema.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
}; 