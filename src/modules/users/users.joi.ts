import * as Joi from 'joi';

export const registrationJoi = Joi.object({
  login: Joi.string().min(3).max(100).required(),
  email: Joi.string().max(100).required().email(),
  password: Joi.string().max(100).required(),
  passwordRepeat: Joi.ref('password'),
}).with('password', 'passwordRepeat');

export const loginJoi = Joi.object({
  login: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

export const findByIdJoi = Joi.object({
  id: Joi.string().length(24).required(),
});

export const findAllJoi = Joi.object({
  excludeIds: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string(),
  ),
  login: Joi.string().min(3).max(100),
  skip: Joi.number().min(0),
  limit: Joi.number().min(1).max(100),
  sortField: Joi.string().valid(...['id', 'login']),
  sortAsc: Joi.string().valid(...['asc', 'desc']),
});

export const findByIdsJoi = Joi.object({
  ids: Joi.array().min(1).items(Joi.string().length(24)),
});
