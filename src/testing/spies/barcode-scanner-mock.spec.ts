export const barcodeScannerMock = {
  result: { hasContent: true, content: null },
  permission: { granted: true },

  prepare: () => Promise.resolve(),
  openAppSettings: () => Promise.resolve(),
  hideBackground: () => Promise.resolve(),
  showBackground: () => Promise.resolve(),
  stopScan: () => Promise.resolve(),
  checkPermission: (_options) => Promise.resolve(barcodeScannerMock.permission),
  startScan: (_options) => Promise.resolve(barcodeScannerMock.result),
};