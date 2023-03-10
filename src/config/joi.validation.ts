import * as Joi from 'joi';
 
export const JoiValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().default('prod'),
    DB_PASSWORD: Joi.required() ,
    DB_NAME: Joi.required(),
    DB_HOST: Joi.required(),
    DB_PORT: Joi.required(),
    DB_USERNAME:  Joi.required(),
    JWT_SECRET: Joi.required()
   
});