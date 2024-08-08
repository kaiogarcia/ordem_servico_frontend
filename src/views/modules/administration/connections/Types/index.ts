export interface ConnectionWhatsApp {
    greetingMessage: string;
    connectionName: string;
    queue: string;
    defaultNumber: boolean;
}

export interface FromApiI {
    connectionName: string;
    defaultNumber: boolean;
    greetingMessage: string;
    lastUpdate: string;
    queue: string;
    session: string;
    status: string;
    _id: string;
}

export interface ConnectionDataI {
    id: string;
    connectionName: string;
    status: string;
    session: string;
    lastUpdate: string;
    default: boolean;
}

export interface TableViewProps {
    setIsMessageError: (newState: boolean) => void
}
