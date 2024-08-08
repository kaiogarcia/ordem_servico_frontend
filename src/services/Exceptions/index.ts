import { AxiosError } from 'axios';
import { toast } from '../../components/Widgets/Toastify';

export const ThrowException = (error: any) => {
    if (error) {
        const { response } = error as AxiosError;
        if (response?.status !== 401) {
            if (Array.isArray(response?.data.message)) {
                response.data.message.forEach((message: string) => {
                    toast.error(message);
                });
            } else {
                toast.error(response.data.message);
            }
        }
    }
};
