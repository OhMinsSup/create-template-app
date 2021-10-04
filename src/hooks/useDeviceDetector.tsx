import { useMemo } from 'react';
import DeviceDetector from 'device-detector-js';

export const useDeviceDetector = () => {
  const deviceDetector = useMemo(() => new DeviceDetector(), []);
  if (typeof window === 'undefined') {
    return null;
  }
  return deviceDetector.parse(window.navigator.userAgent);
};
