$(document).ready(function() {
    const apiUrlPod = apiServerIP + '/api/v1/namespaces/' + namespace + '/pods/';
    const apiUrlNode = apiServerIP + '/api/v1/nodes/';
    getNodes();
    getPods();
    window.setInterval( function() {
        getNodes();
        getPods();
    }, 2000);

    var app = new Vue({
        el: '#app',
        data: {
            podList: [],
            nodeList: ['node-1', 'minikube', 'node-3']
        },
        methods: {
            updatePods: function (podList) {
                this.podList = podList;
            },
            deletePod: function () {
                const hostname = event.currentTarget.innerHTML;
                $.ajax({
                    url: apiUrlPod + hostname,
                    crossDomain:true,
                    contentType: "application/json",
                    type: 'DELETE',
                    success: function(data) {
                        console.log(data)
                    },
                });
            },
            updateNodes: function (nodeList) {

            }
        }
    });

    function getNodes() {
        $.ajax({
            url: apiUrlNode,
            crossDomain:true,
            type: 'get',
            success: function(data) {
                analyseNodeData(data);
            }
        });
    }

    function analyseNodeData(nodeData) {
        // console.log(nodeData);
        var nodeList = [];
        var items = nodeData.items;
        for (i = 0; i < items.length; i++) {
            console.log(items[i].metadata.name);
            nodeList.push(items[i].metadata.name);
        }

        // app.nodeList = nodeList;
    }

    function getPods() {
        $.ajax({
            url: apiUrlPod,
            crossDomain:true,
            type: 'get',
            success: function(data) {
                analysePodData(data);
            }
        });
    }

    function analysePodData(podData) {
        var podList = [];
        var items = podData.items;
        var color = 'silver';
        var status;
        var cpu;
        var memory;
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

            if (item.spec.containers[0].resources.requests != undefined) {
               cpu = item.spec.containers[0].resources.requests.cpu;
               memory = item.spec.containers[0].resources.requests.memory;
            }

            podList.push(
                {
                    'hostname': item.metadata.name,
                    'color': color,
                    'status': status,
                    'cpu': cpu,
                    'memory': memory,
                    'nodename': item.spec.nodeName
                }
            );
            // console.log(item.spec.nodeName);
        }
        app.updatePods(podList);
        // console.log('function called');
    }
});
