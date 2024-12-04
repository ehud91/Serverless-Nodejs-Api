const { z } = require('zod');

async function validateLead(postData) {
    const lead = z.object({
        email: z.string().email()
    });

    let hasError;
    let validData = {};
    let message;
    try {
        validData = lead.parse(postData);
        hasError = false;
        message = '';
    } catch (err) {
        hasError = true;
        message = 'Invalid emai, please try again.';
    } 
    

    return {
        data: {},
        hasError: hasError,
        message: message,
    };
}

module.exports.validateLead = validateLead;