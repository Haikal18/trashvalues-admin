import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
