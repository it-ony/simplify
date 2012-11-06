define(['js/core/Module', 'js/core/I18n'], function(Module, I18n) {
    return Module.inherit({
        inject: {
            i18n: I18n,
            user: "user"
        }
    });
});