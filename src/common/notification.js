define([], function () {

    const options = {
        lite: {
            icon: 'glyphicon glyphicon-ok-sign'
        },
        regular: {
            icon: 'glyphicon glyphicon-info-sign'

        },
        serious: {
            icon: 'glyphicon glyphicon-exclamation-sign'
        }
    }

    return {
        notify: notify

    };
});