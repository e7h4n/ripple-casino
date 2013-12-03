var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var registryForm = forms.create({
    username: fields.string({
        required: true
    }),
    password: fields.password({
        required: true
    }),
    confirm:  fields.password({
        required: true,
        validators: [validators.matchField('password')]
    })
});

module.exports = registryForm;
