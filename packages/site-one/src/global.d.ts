import { useHistory } from 'react-router';

declare global {
  interface Window {
    renderSiteOne: any;
    unmountSiteOne: any;
  }
}

export type RRHistory = ReturnType<typeof useHistory>;
