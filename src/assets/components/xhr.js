export function Request(type, link) {

    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();

        xhr.open(type, link);

        xhr.send();

        xhr.onload = function () {
            if (xhr.status != 200) {
                reject(error);
                console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                resolve(this.response);
            }
        };

        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                //console.log(`Received ${event.loaded} of ${event.total} bytes`);
            } else {
                //console.log(`Received ${event.loaded} bytes`);
            }
        };

        xhr.onerror = function () {
            console.log("Request failed");
            reject(new Error("Network Error"));
        };

    });

}