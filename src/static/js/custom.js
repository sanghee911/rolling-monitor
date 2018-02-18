$(document).ready(function() {
    var apiURL = apiServerIP + '/api/v1/namespaces/' + namespace + '/pods';
    // window.setInterval( function() {
        $.ajax({
            url: apiURL,
            crossDomain:true,
            type: 'get',
            success: function(data) {
                updateServers(data);
            }
        });
    // }, 5000);
    console.log(apiURL);

    function updateServers(data) {
        var items = data.items;
        var servers = [];
        console.log(items);
        for (item of items) {
            if (item.metadata.name.includes('rolling-express')) {
                console.log(item.metadata.name, item.status.podIP);
                servers.push('http://' + item.status.podIP + ':8080');
            }
        }

        console.log(servers);

        for (server in servers) {
            $.ajax({
                url: server,
                crossDomain:true,
                type: 'get',
                success: function(data) {
                    console.log(data);
                }
            });
        }
    }

});
