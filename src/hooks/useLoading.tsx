import React, { createContext, useContext, useState } from 'react';

interface LoadingContextData {
    isLoading: boolean;
    Loading: {
        turnOff: () => void;
        turnOn: () => void;
    };
}

const LoadingContext = createContext<LoadingContextData>({} as LoadingContextData);

interface LoadingProviderProps {
    children: React.ReactNode;
}

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const turnOff = () => {
        setIsLoading(false);
    };

    const turnOn = () => {
        setIsLoading(true);
    };

    const Loading = {
        turnOff,
        turnOn
    };

    return <LoadingContext.Provider value={{ isLoading, Loading }}>{children}</LoadingContext.Provider>;
};

const useLoading = () => useContext(LoadingContext);

export { LoadingProvider, useLoading };
