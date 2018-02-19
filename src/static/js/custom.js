$(document).ready(function() {
    const apiUrl = apiServerIP + '/api/v1/namespaces/' + namespace + '/pods/';
    getPods();
    window.setInterval( function() {
        getPods();
    }, 2000);

    var app = new Vue({
        el: '#app',
        data: {
            serverList: []
        },
        methods: {
            showServers: function () {
                // console.log(this.serverList);
            },
            updateServers: function (serverList) {
                this.serverList = serverList;
            },
            deletePod: function () {
                const hostname = event.currentTarget.innerHTML;
                $.ajax({
                    url: apiUrl + hostname,
                    crossDomain:true,
                    contentType: "application/json",
                    type: 'DELETE',
                    success: function(data) {
                        console.log(data)
                    },
                });
                // console.log(hostname);
            }
        }
    });

    function getPods() {
        $.ajax({
            url: apiUrl,
            crossDomain:true,
            type: 'get',
            success: function(data) {
                getServers(data);
            }
        });
    }

    function getServers(data) {
        var serverList = [];
        var items = data.items;
        var color;
        for (item of items) {
            try {
                color = item.spec.containers[0].env[0].value;
            }
            catch (err) {
                color = 'silver';
            }
            serverList.push(
                {
                    'hostname': item.metadata.name,
                    'color': color,
                    'status': item.status.phase,
                    'nodename': item.spec.nodeName
                }
            );
            // console.log(item.spec.nodeName);
        }
        app.updateServers(serverList);
        // console.log('function called');
    }
});
