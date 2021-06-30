import Joi from 'joi';

export const joischema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  qty: Joi.number().integer().min(0).required(),
  description: Joi.string().alphanum().min(5).max(10000).required(),
});
