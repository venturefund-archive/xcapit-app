export const WHITELIST: { url: string, httpCode: number }[] = [
    {
        url: 'get_all_operations',
        httpCode: 401
    },
    {
        url: '1/create_operation',
        httpCode: 401
    },
    {
        url: '1/get_user_operation',
        httpCode: 401
    },
    {
        url: '1/confirm_operation',
        httpCode: 401
    },
    {
        url: '1/save_user_info',
        httpCode: 401
    },
    {
        url: '1/save_user_image',
        httpCode: 401
    },
    {
        url: '1/save_user_bank',
        httpCode: 401
    },
];