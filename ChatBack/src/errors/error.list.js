const BaseError = require('./base.error');

const Errors = {
    U_E: new BaseError(400, 'U_E', 'Username exist!'),
    E_E: new BaseError(400, 'E_E', 'Email exist!'),
    F_S_NE: new BaseError(400, 'F_S_NE', 'Fields should not be empty!'),
    E_OR_P_NC: new BaseError(
        400,
        'E_OR_P_NC',
        'Email or password is not correct!'
    ),
    U_NF: new BaseError(404, 'U_NF', 'User not found!'),
    C_NF: new BaseError(404, 'C_NF', 'Chat not found!'),
    N_SI: new BaseError(401, 'N_SI', 'Not signed in!'),
    I_T: new BaseError(401, 'I_T', 'Invalid token!'),
    T_R: new BaseError(401, 'T_R', 'Token required!'),
};

module.exports = Errors;
