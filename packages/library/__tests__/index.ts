import {
  drawBeaconHandleDrawStartAndComplete,
  beaconDrawLockAndNetworkTotalSupplyPush,
  receiverDrawLockAndNetworkTotalSupplyPush,
} from '../src';

describe('exports', () => {
  it('should have all expected exports defined', () => {
    expect(drawBeaconHandleDrawStartAndComplete).toBeDefined();
    expect(beaconDrawLockAndNetworkTotalSupplyPush).toBeDefined();
    expect(receiverDrawLockAndNetworkTotalSupplyPush).toBeDefined();
  });
});
