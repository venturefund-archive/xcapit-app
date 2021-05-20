export const mockStoragePlugin = {
    get: ({key}) => Promise.resolve({value: 'topo'}),
    set: ({key, value}) => Promise.resolve(),
    remove: ({key}) => Promise.resolve(),
    clear: () => Promise.resolve(),
    keys: () => Promise.resolve({keys: []}),
    addListener: () => null,
};
