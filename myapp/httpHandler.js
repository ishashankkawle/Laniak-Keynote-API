import axios from "axios";

function getDefaultHeaders() {
    return { "Content-Type": "application/json" }
    //return { "Content-Type": "application/java" }
}
function getDefaultMultipartHeaders() {
    return { 'Content-Type': undefined }
}

async function httpGet(url, customHeaders = this.getDefaultHeaders()) {
    //let response = await fetch(url, {
    //    method: 'GET',
    //    headers: customHeaders
    //})
    //let data = await response.json()
    //return data;

    let data = axios.get(url, {headers: customHeaders}).then(function (response) {
        return response.data;
    });
    return data;
}


async function httpPost(url, reqBody, customHeaders = this.getDefaultHeaders()) {
    //let response = await fetch(url, {
    //    method: 'POST',
    //    headers: customHeaders,
    //    body: JSON.stringify(reqBody)
    //})
    //let data = await response.json()
    //return data;
    let data = await axios.post(url, reqBody, { headers: customHeaders}).then(function (response) {
        return response.data;
    });
    return data;
}

async function httpPut(url, reqBody, customHeaders = this.getDefaultHeaders()) {
    // let response = await fetch(url, {
    //     method: 'PUT',
    //     headers: customHeaders,
    //     body: JSON.stringify(reqBody)
    // })
    // let data = await response.json()
    // return data;
    let data = await axios.put(url, reqBody, { headers: customHeaders}).then(function (response) {
        return response.data;
    });
    return data;
}


export { getDefaultHeaders, getDefaultMultipartHeaders, httpGet, httpPost, httpPut }