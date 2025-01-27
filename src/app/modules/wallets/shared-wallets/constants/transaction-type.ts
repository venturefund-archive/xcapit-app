export const transactionType = [
    {
        name: 'swapETHForExactTokens',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 0,
        data: [{}],
        hasValue: true,
        in: 'amountInMax',
        out: 'amountOut'
    },
    {
        name: 'swapExactETHForTokens',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 0,
        data: [{}],
        hasValue: true,
        in: 'amountIn',
        out: 'amountOutMin'
    },
    {
        name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 0,
        data: [{}],
        hasValue: true,
        in: 'amountIn',
        out: 'amountOut'
    },
    {
        name: 'swapExactTokensForETH',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 1,
        data: [{}],
        hasValue: false,
        in: 'amountIn', 
        out: 'amountOutMin'
    },
    {
        name: 'swapExactTokensForTokens',
        type: 'swap',
        action: 'swap',
        useNative: false,
        nativeOrder: 0,
        data: [{}],
        hasValue: false,
        in: 'amountIn', 
        out: 'amountOutMin'
    },
    {
        name: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 1,
        data: [{}],
        hasValue: false,
        in: 'amountIn', 
        out: 'amountOutMin'
    },
    {
        name: 'swapExactTokensForTokens',
        type: 'swap',
        action: 'swap',
        useNative: false,
        nativeOrder: 0,
        data: [{}],
        hasValue: false,
        in: 'amountIn',
        out: 'amountOutMin'
    },
    {
        name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
        type: 'swap',
        action: 'swap',
        useNative: false,
        nativeOrder: 0,
        data: [{}],
        hasValue: false,
        in: 'amountIn',
        out: 'amountOutMin'
    },
    {
        name: 'swapTokensForExactETH',
        type: 'swap',
        action: 'swap',
        useNative: true,
        nativeOrder: 1,
        data: [{}],
        hasValue: false,
        in: 'amountInMax',
        out: 'amountOut'
    },
    {
        name: 'swapTokensForExactTokens',
        type: 'swap',
        action: 'swap',
        useNative: false,
        nativeOrder: 0,
        data: [{}],
        hasValue: false,
        in: 'amountInMax',
        out: 'amountOut'
    },
    {
        name: 'addLiquidity',
        type: 'liquidity',
        action: 'add_liquidity',
        useNative: false,
        data: [{}],
        hasValue: false,
        amount0: 'amountADesired',
        amount1: 'amountBDesired',
        liquidity: false
    },
    {
        name: 'addLiquidityETH',
        type: 'liquidity',
        action: 'add_liquidity',
        useNative: true,
        data: [{}],
        hasValue: true,
        amount0: 'amountTokenDesired',
        liquidity: false
    },
    {
        name: 'removeLiquidity',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: false,
        data: [{}],
        hasValue: false,
        amount0: 'amountAMin',
        amount1: 'amountBMin',
        liquidity: true
    },
    {
        name: 'removeLiquidityETH',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: true,
        data: [{}],
        hasValue: false,
        amount0: 'amountTokenMin',
        amount1: 'amountETHMin',
        liquidity: true
    },
    {
        name: 'removeLiquidityETHSupportingFeeOnTransferTokens',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: true,
        data: [{}],
        hasValue: false,
        amount0: 'amountTokenMin',
        amount1: 'amountETHMin',
        liquidity: true
    },
    {
        name: 'removeLiquidityETHWithPermit',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: true,
        data: [{}],
        hasValue: false,
        amount0: 'amountTokenMin',
        amount1: 'amountETHMin',
        liquidity: true
    },
    {
        name: 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: true,
        data: [{}],
        hasValue: false,
        amount0: 'amountTokenMin',
        amount1: 'amountETHMin',
        liquidity: true
    },
    {
        name: 'removeLiquidityWithPermit',
        type: 'liquidity',
        action: 'remove_liquidity',
        useNative: false,
        data: [{}],
        hasValue: false,
        amount0: 'amountAMin',
        amount1: 'amountBMin',
        liquidity: true
    },

];