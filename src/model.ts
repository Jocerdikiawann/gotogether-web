export interface LocationResponse {
    id: number,
    data: LocationObject,
    azimuth: number,
}

export interface LocationObject {
    lat: number;
    lng: number;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface DestinationAndPolyline {
    id: string;
    encodedRoute: string;
    destination: Location;
    initialLocation: Location,
    senderName: string,
    destinationName: string,
    estimateTime: string,
    locationName: string,
}

export interface DestinationAndPolylineResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: DestinationAndPolyline;
}