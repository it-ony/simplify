define(['js/core/Module', 'js/core/I18n'], function(Module, I18n) {
    return Module.inherit({
        injection: {
            i18n: I18n,
            user: "user"
        }
    });
});