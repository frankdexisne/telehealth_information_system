import { useEffect, Suspense, Fragment, ComponentType } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import { authActions } from "./store/slices/auth";
import routes from "./routes";
import { DefaultLayout } from "./layouts";
import { RootState } from "./store";
import { getRequest } from "./hooks";
import { selectActions } from "./store/slices/selects";
import NotFound from "./pages/errors/NotFound";
import { ADMINISTRATOR } from "./interfaces/RoleList";
import socket from "./socket";

interface RenderElementProps {
  Component: ComponentType<any>;
  isPrivate: boolean;
}

const RenderElement = ({ isPrivate, Component }: RenderElementProps) => {
  if (isPrivate) {
    return (
      <DefaultLayout>
        <Component />
      </DefaultLayout>
    );
  }

  return <Component />;
};

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.user.role_name);
  const permissionLists = useSelector(
    (state: RootState) => state.auth.permissions
  );
  const storageToken = localStorage.getItem(import.meta.env.VITE_TOKEN_NAME);
  const storageUser = localStorage.getItem("user");
  const storagePermissions = localStorage.getItem("permissions");

  const connectedHandler = (data: object) => {
    console.log("connected", data);
  };

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      if (storageToken) dispatch(authActions.setToken(storageToken));
      if (storageUser) dispatch(authActions.setUser(JSON.parse(storageUser)));
      if (storagePermissions)
        dispatch(authActions.setPermissions(JSON.parse(storagePermissions)));
    }, 500);
    socket.on("connected", connectedHandler);
    return () => {
      clearTimeout(fetchTimeout);
      socket.off("connected", connectedHandler);
    };
  }, [storageToken, storageUser, storagePermissions, dispatch]);

  useEffect(() => {
    const fetchTimeout = setTimeout(async () => {
      if (isLoggedIn) {
        getRequest("/libraries/select").then((res) => {
          const {
            teleclerks,
            departments,
            doctors,
            designations,
            consultation_statuses,
            patient_conditions,
            dispositions,
            platforms,
            roles,
          } = res.data;
          dispatch(selectActions.setTeleclerks(teleclerks));
          dispatch(selectActions.setDoctors(doctors));
          dispatch(selectActions.setDepartments(departments));
          dispatch(selectActions.setDesignations(designations));
          dispatch(selectActions.setDispositions(dispositions));
          dispatch(selectActions.setRoles(roles));
          dispatch(selectActions.setPatientConditions(patient_conditions));
          dispatch(
            selectActions.setConsultationStatuses(consultation_statuses)
          );
          dispatch(selectActions.setPlatforms(platforms));
        });

        getRequest("/homis/select").then((res) => {
          const { civil_statuses, suffixes, regions } = res.data;
          dispatch(selectActions.setCivilStatuses(civil_statuses));
          dispatch(selectActions.setSuffixes(suffixes));
          dispatch(selectActions.setRegions(regions));
        });
      }
    }, 500);

    return () => clearTimeout(fetchTimeout);
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader color="blue" />}>
        <Routes>
          {routes.map(
            (
              { isPrivate, permission, Component, path, childRoutes },
              index: number
            ) => {
              if (childRoutes) {
                return (
                  <Route
                    path={path}
                    element={
                      <RenderElement
                        isPrivate={isPrivate || false}
                        Component={Component}
                      />
                    }
                  >
                    {childRoutes
                      .filter(
                        (item) =>
                          role === ADMINISTRATOR ||
                          permissionLists.includes(item.permission as string)
                      )
                      .map((childRoute) => (
                        <Route
                          path={childRoute.path}
                          element={<childRoute.Component />}
                        />
                      ))}
                  </Route>
                );
              }

              if (
                role === ADMINISTRATOR ||
                permissionLists?.includes(permission as string)
              ) {
                return (
                  <Fragment key={index}>
                    <Route
                      path={path}
                      element={
                        isPrivate &&
                        !localStorage.getItem(
                          import.meta.env.VITE_TOKEN_NAME
                        ) ? (
                          <Navigate to="/login" />
                        ) : (
                          <>
                            {isPrivate && (
                              <DefaultLayout>
                                <Component />
                              </DefaultLayout>
                            )}
                            {!isPrivate && <Component />}
                          </>
                        )
                      }
                    />
                  </Fragment>
                );
              }

              return (
                <Fragment key={index}>
                  {!permission && (
                    <Route
                      path={path}
                      element={
                        isPrivate &&
                        !localStorage.getItem(
                          import.meta.env.VITE_TOKEN_NAME
                        ) ? (
                          <Navigate to="/login" />
                        ) : (
                          <>
                            {isPrivate && (
                              <DefaultLayout>
                                <Component />
                              </DefaultLayout>
                            )}
                            {!isPrivate && <Component />}
                          </>
                        )
                      }
                    />
                  )}
                </Fragment>
              );
            }
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
