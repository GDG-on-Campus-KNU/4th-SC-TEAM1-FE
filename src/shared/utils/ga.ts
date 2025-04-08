import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-T2B79W5QY5'); // 본인의 측정 ID 입력
};

export const sendPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
