const BaseError = require('./base.error');

const Errors = {
    L_E: new BaseError(400, 'L_E', 'Login exist!'),
    L_OR_P_NC: new BaseError(
        400,
        'L_OR_P_NC',
        'Login or password is not correct!'
    ),
    N_SI: new BaseError(401, 'N_SI', 'Not signed in!'),
    I_T: new BaseError(401, 'I_T', 'Invalid token!'),
    T_R: new BaseError(401, 'T_R', 'Token required!'),
};

module.exports = Errors;
