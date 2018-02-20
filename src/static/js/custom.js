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
        var color = 'silver';
        var status;
        for (item of items) {
            if (item.spec.containers[0].env != undefined) {
                for (var i=0; i < item.spec.containers[0].env.length; i++) {
                    if (item.spec.containers[0].env[i].name == 'COLOR') {
                        color = item.spec.containers[0].env[i].value;
                        break;
                    } else {
                        color = 'silver';
                    }
                }
            }

            if (item.metadata.deletionTimestamp) {
                status = 'Terminating';
            } else {
                status = item.status.phase;
            }
            serverList.push(
                {
                    'hostname': item.metadata.name,
                    'color': color,
                    'status': status,
                    'nodename': item.spec.nodeName
                }
            );
            // console.log(item.spec.nodeName);
        }
        app.updateServers(serverList);
        // console.log('function called');
    }
});
