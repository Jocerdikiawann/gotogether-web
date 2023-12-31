import { writable, type Writable, } from 'svelte/store';
import { connect, type IClientOptions } from "mqtt"
import { AsyncClient } from 'async-mqtt'
import type { DestinationAndPolylineResponse, LocationObject, LocationResponse } from "./model"


interface DestinationState {
    lat: number;
    lng: number;
}

interface LocationState {
    lat: number;
    lng: number;
}

interface PolylineState {
    polyline: string
}

interface InfoState {
    senderName: string,
    destinationName: string,
    estimateTime: string,
    locationName: string,
}

let client: AsyncClient;

export const destination: Writable<DestinationState> = writable({ lat: 0, lng: 0 })
export const location: Writable<LocationState> = writable({ lat: 0, lng: 0 })
export const polyline: Writable<PolylineState> = writable({ polyline: "" })
export const rotation: Writable<number> = writable(0)
export const info: Writable<InfoState> = writable({ senderName: "", destinationName: "", estimateTime: "", locationName: "" })

export const connectMqtt = async (options: IClientOptions, url: string, topic: string) => {
    client = new AsyncClient(connect(url, options));
    client.on("connect", () => {
        console.log("SUCCESS CONNECT MQTT BROKER");
    });
    await client.subscribe(topic, { qos: 1 })
    client.on("message", (_: string, message: Buffer) => {
        const data = JSON.parse(message.toString()) as LocationResponse
        location.set(data.data)
        rotation.set(data.azimuth)
    })
}


export const disconnectMqtt = async () => {
    if (client) {
        console.log("DISCONNECT")
        await client.end()
    }
}

export const getDestination = async (url: string) => {
    const makeRequest = await fetch(url)
    const response = await makeRequest.json() as DestinationAndPolylineResponse
    const data = response.data
    const destinationResponse = data.destination
    const locationResponse = data.initialLocation

    destination.set({
        lat: destinationResponse.latitude,
        lng: destinationResponse.longitude
    })

    info.set({
        destinationName: data.destinationName,
        locationName: data.locationName,
        estimateTime: data.estimateTime,
        senderName: data.senderName
    })

    location.set({
        lat: locationResponse.latitude,
        lng: locationResponse.longitude
    })

    polyline.set({
        polyline: response.data.encodedRoute
    })
}