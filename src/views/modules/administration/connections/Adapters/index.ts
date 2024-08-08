import { ConnectionDataI, ConnectionWhatsApp, FromApiI } from '../Types';

export const toApi = (connectionWhatsApp: ConnectionWhatsApp): ConnectionWhatsApp => {
    return {
        connectionName: connectionWhatsApp.connectionName,
        greetingMessage: connectionWhatsApp.greetingMessage,
        queue: connectionWhatsApp.queue,
        defaultNumber: connectionWhatsApp.defaultNumber
    };
};

export const fromApi = (data: FromApiI[]): ConnectionDataI[] => {
    return data.map((item) => {
        return {
            id: item._id,
            connectionName: item.connectionName,
            status: item.status,
            session: item.session,
            lastUpdate: item.lastUpdate,
            default: item.defaultNumber
        };
    });
};
