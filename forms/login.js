var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var loginForm = forms.create({
    username: fields.string({
        required: true
    }),
    password: fields.password({
        required: true
    })
});

module.exports = loginForm;
