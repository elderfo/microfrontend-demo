import { useHistory } from 'react-router';

declare global {
  interface Window {
    renderSearch: any;
    unmountSearch: any;
  }
}

export type RRHistory = ReturnType<typeof useHistory>;
