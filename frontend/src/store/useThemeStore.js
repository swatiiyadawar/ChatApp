import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee", // Retrieve the initial theme from localStorage
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme); // Save the theme in localStorage
        set({ theme }); // Update the Zustand store state
    },
}));
