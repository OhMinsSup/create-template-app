// Declarations for modules without types
declare module '*.scss' {
  const content: {
    [className: string]: string;
  };
  export default content;
}

declare global {
  interface Window {
    IMP: IMP;
    Kakao: Kakao;
    gapi: gapi;
    gtag: Gtag;
  }
}

declare module '@multiavatar/multiavatar/esm' {
  export default function (arg: string): string;
}
