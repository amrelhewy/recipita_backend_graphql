import Joi from 'joi'

export const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .message("username too short.")
        .max(30)
        ,

    password: Joi.string()
        .min(3).message('password too short.'),
    email: Joi.string().
        email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).message('email is weird'),

    role_id: Joi.number().min(1).message('add a role.')
})
