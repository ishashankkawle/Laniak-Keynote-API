import axios from "axios";

class httpHandler 
{

    getDefaultHeaders() {
        return { "Content-Type": "application/json" }
        //return { "Content-Type": "application/java" }
    }
    getDefaultMultipartHeaders() {
        return { 'Content-Type': undefined }
    }

    async httpGet(url, customHeaders = this.getDefaultHeaders()) {
        //let response = await fetch(url, {
        //    method: 'GET',
        //    headers: customHeaders
        //})
        //let data = await response.json()
        //return data;

        let data = axios.get(url, { headers: customHeaders }).then(function (response) {
            return response.data;
        });
        return data;
    }


    async httpPost(url, reqBody, customHeaders = this.getDefaultHeaders()) {
        //let response = await fetch(url, {
        //    method: 'POST',
        //    headers: customHeaders,
        //    body: JSON.stringify(reqBody)
        //})
        //let data = await response.json()
        //return data;
        let data = await axios.post(url, reqBody, { headers: customHeaders }).then(function (response) {
            return response.data;
        });
        return data;
    }

    async httpPut(url, reqBody, customHeaders = this.getDefaultHeaders()) {
        // let response = await fetch(url, {
        //     method: 'PUT',
        //     headers: customHeaders,
        //     body: JSON.stringify(reqBody)
        // })
        // let data = await response.json()
        // return data;
        let data = await axios.put(url, reqBody, { headers: customHeaders }).then(function (response) {
            return response.data;
        });
        return data;
    }

}
export default httpHandler;