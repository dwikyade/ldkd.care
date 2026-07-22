import { AxiosInstance } from 'axios';
import { Config, RouteName, RouteParamsWithQueryOverload } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    // Since we don't have ziggy-js installed via npm yet, we use generic any types for route
    // or we can just declare the route function
    function route(
        name: string,
        params?: any,
        absolute?: boolean,
        config?: any
    ): string;
}
