const joi = require("joi");

module.exports.userSchema=joi.object({
        firstName:joi.string().required(),
        lastName:joi.string().allow('').optional(),
        password:joi.string().required(),
        accountType:joi.string().valid('Admin', 'User', 'Owner').required(),
        email:joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
});