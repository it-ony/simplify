define(['app/module/ModuleBase'], function(ModuleBase) {
    return ModuleBase.inherit('app.module.MainModuleClass', {

        defaultRoute: function(routeContext) {
            routeContext.router.navigate("m/home");
        }
    });
});