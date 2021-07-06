import axios from 'axios';

const parseResponse = (response: any) => {
    return response.data;
};

const headers = {
    'Content-Type': 'application/json',
    Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6Ik5ndXnhu4VuIEto4bqvYyBWaW5oIiwiZW1haWwiOiJ2aW5obmtAaW5ldC52biIsImlkIjo0MzIyNzYsInBob25lIjoiMDk2ODgzOTQ5NiIsImF2YXRhciI6Imh0dHBzOi8vc3NvLmluZXQudm4vdXBsb2Fkcy8xNjEzNjM0ODY3NDE0XzJmZmQ5ZjQ5MWI3ZWQzN2RjMmM5LnBuZyIsImFkZHJlc3MiOiJT4buRIDMsIG5nw6FjaCA4Ny84IMSRxrDhu51uZyBDaGnhur9uIFRo4bqvbmcsIETGsMahbmcgTGnhu4V1LCBIb8OgaSDEkOG7qWMsIEjDoCBO4buZaSIsImdlbmRlciI6Im1hbGUiLCJpZE51bWJlciI6IjAxNzM2OTY0OCIsInByb3ZpbmNlIjoiSE5JIiwiY291bnRyeSI6IlZOIiwiaWF0IjoxNjI0MzIzNTEwfQ.Cm6CtKkA9ngZ9LtgHW49Lnq9E-LGTGo1AI_GHOecOuA',
    'x-api-key': 'Z8#KE!KxdwCuT9Wf',
};

export function get(url: string) {
    return axios.get(url).then(parseResponse);
}

export function post(url: string, body: any) {
    return axios.post(url, body, { headers }).then(parseResponse);
}
