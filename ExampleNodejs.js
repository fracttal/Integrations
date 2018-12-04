var Request = require('request'),
    id = INGRESA_TU_ID,
    key = INGRESA_TU_KEY;

var consultaActivos = function () {

    var requestOptions = {
        uri: 'https://app.fracttal.com/api/inventories_details/',
        method: 'GET',
        headers: {},
        hawk: {
            credentials: {
                id: id,
                key: key,
                algorithm: 'sha256'
            }
        }
    };

    Request(requestOptions, function (error, response, body) {

        if (error) {
            console.log('error');
        } else {
            var result = JSON.parse(body);

            if (result['message'] == 200) {
                var arr = result['data'].map(function (obj) {
                    console.log(obj);
                });
            }
        }

    });
};

consultaActivos();

