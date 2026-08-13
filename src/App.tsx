import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/components/ui/Toast";
import { AppProvider } from "@/lib/app-context";
import { AppShell } from "@/components/layout/AppShell";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
