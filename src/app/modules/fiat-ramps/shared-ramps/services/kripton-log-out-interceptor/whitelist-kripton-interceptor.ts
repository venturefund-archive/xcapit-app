export const WHITELIST: { url: string, httpCode: number }[] = [
    {
        url: 'get_all_operations',
        httpCode: 500
    },
    {
        url: '1/create_operation',
        httpCode: 400
    },
    {
        url: '1/get_user_operation',
        httpCode: 500
    },
];