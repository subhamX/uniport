import create from "zustand";
import { combine } from "zustand/middleware";

export const useSideNavStore = create(
    combine({
            status: false
        },
        set => ({
            toggleSideNavStatus: () => set((state: any) => ({ status: !state.status })),
            close: () => set({status: false})
        })
    )
);