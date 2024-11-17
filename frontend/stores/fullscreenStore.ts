import { create } from 'zustand';

interface FullscreenState {
    screenRef: HTMLElement | null;
    isFullscreen: boolean;
    setScreenRef: (element: HTMLElement | null) => void;
    toggleFullscreen: () => void;
  }
  
  const useFullscreenStore = create<FullscreenState>((set, get) => ({
    screenRef: null,
    isFullscreen: false,
    setScreenRef: (element: HTMLElement | null) => set({ screenRef: element }),
    toggleFullscreen: () => {
      const { screenRef, isFullscreen } = get(); 
  
      if (!screenRef) return; 
  
      if (!isFullscreen) {
        screenRef.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
        set({ isFullscreen: true });
      } else {
        document.exitFullscreen();
        set({ isFullscreen: false });
      }
    },
  }));
  
  export default useFullscreenStore;