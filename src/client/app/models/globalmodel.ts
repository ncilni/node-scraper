export const BASE_URL = "http://localhost:5000/";

export const Apicall = {
    'api':'api',
    'yelpSearch': 'api/searchyelp',
    'ypSearch':'api/searchyp',
    'mantaSearch':'api/searchmanta'
}


export type ypSearch = {
    name:string,
    id:number,
    website:string
}

export type state =  ypSearch[];