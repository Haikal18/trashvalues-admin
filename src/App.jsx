import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { publicRoutes, protectedRoutes } from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}

            <Route element={<ProtectedRoute />}>
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                >
                  {route.children?.map((childRoute) => (
                    <Route
                      key={childRoute.path}
                      path={childRoute.path}
                      element={
                        childRoute.redirectTo ? (
                          <Navigate to={childRoute.redirectTo} replace />
                        ) : (
                          <childRoute.component />
                        )
                      }
                    />
                  ))}
                </Route>
              ))}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
