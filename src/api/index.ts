import axios from 'axios';

const parseResponse = (response: any) => {
    return response.data;
};

const headers = {
    'Content-Type': 'application/json',
    Authorization: process.env.SID,
    'x-api-key': 'Z8#KE!KxdwCuT9Wf',
};

export function get(url: string) {
    return axios.get(url).then(parseResponse);
}

export function post(url: string, body: any) {
    return axios.post(url, body, { headers }).then(parseResponse);
}
