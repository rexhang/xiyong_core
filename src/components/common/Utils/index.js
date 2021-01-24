export function debounce(fun, delay) {
    return function (args) {
        const vm = this;
        const _args = args;
        clearTimeout(fun.id);
        fun.id = setTimeout(function () {
            fun.call(vm, _args);
        }, delay);
    };
}