const IMAGE_SERVER = 'https://images.evetech.net';

export const getAllianceIcon = (id: number, size = 64) => `${IMAGE_SERVER}/alliances/${id}/logo?size=${size}`;
export const getCorporationIcon = (id: number, size = 64) => `${IMAGE_SERVER}/corporations/${id}/logo?size=${size}`;