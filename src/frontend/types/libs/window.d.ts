// Ensure this is treated as a module.
export {};

declare global {
  interface Window {
    converse: {
      insertInto: (container: HTMLElement) => void;
      initialize: (options: any) => void;
      env: any;
      plugins: {
        add: (name: string, plugin: any) => void;
      };
    };
    JitsiMeetExternalAPI: JitsiMeetExternalAPI;
  }
}
