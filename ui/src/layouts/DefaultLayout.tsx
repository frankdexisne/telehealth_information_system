import {
  AppShell,
  Burger,
  Group,
  Menu,
  Button,
  rem,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RootState } from "../store";
import { PropsWithChildren, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavBar } from ".";
import {
  IconUserCircle,
  IconLogout,
  IconUserCog,
  IconPassword,
  IconX,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { postRequest } from "../hooks";
import { authActions } from "../store/slices/auth";
import { NavLink } from "react-router-dom";
import { notifications, Notifications } from "@mantine/notifications";
import socket from "../socket";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../assets/brhmclogo.png";
import { useMediaQuery } from "@mantine/hooks";

interface HandlerProps {
  title: string;
  message: string;
}

function DefaultLayout({ children }: PropsWithChildren) {
  const isMobile = useMediaQuery("max-width:481px");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const user = useSelector((state: RootState) => state.auth.user);

  const logoutHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Logout your account",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logged it out",
    }).then((result) => {
      if (result.isConfirmed) {
        postRequest("/auth/logout", {}).then(() => {
          dispatch(authActions.removeToken());
          window.location.href = "/login";
        });
      }
    });
  };

  const Notify = (title: string, message: string) => {
    notifications.show({
      title: title,
      message: message,
      color: "green",
    });
  };

  const untriagedHandler = ({ title, message }: HandlerProps) => {
    [
      `tableData:patients`,
      `tableData:consultations/new-consultations`,
      `tableData:consultations/un-triage-consultations`,
    ].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    Notify(title, message);
  };

  const followUpHandler = ({ title, message }: HandlerProps) => {
    [`consultations/follow-up-consultations`].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    Notify(title, message);
  };

  const triagedHandler = ({ title, message }: HandlerProps) => {
    [
      `tableData:consultations/triaged-consultations`,
      `tableData:consultations/un-triage-consultations`,
    ].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    console.log(title, message);
    Notify(title, message);
  };

  const assigneddHandler = ({ title, message }: HandlerProps) => {
    [
      `tableData:consultations/triaged-consultations`,
      `tableData:consultations/active-consultations`,
      `tableData:doctors/active-consultations`,
      `tableData:doctors/follow-up-consultations`,
    ].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    Notify(title, message);
  };

  const outWhenCalledHandler = ({ title, message }: HandlerProps) => {
    [
      `tableData:consultations/out-when-called-consultations`,
      `tableData:doctors/out-when-called`,
    ].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    Notify(title, message);
  };

  const lockedConsultationHandler = ({ title, message }: HandlerProps) => {
    [
      `tableData:consultations/completed-consultations`,
      `tableData:consultations/active-consultations`,
      `tableData:doctors/active-consultations`,
      `tableData:doctors/completed-consultations`,
    ].map((key: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(key),
      });
    });
    Notify(title, message);
  };

  useEffect(() => {
    socket.on("created", untriagedHandler);
    socket.on("triaged", triagedHandler);
    socket.on("assigned", assigneddHandler);
    socket.on("locked", lockedConsultationHandler);
    socket.on("out-when-called", outWhenCalledHandler);
    socket.on("follow-up", followUpHandler);
    return () => {
      socket.off("created", untriagedHandler);
      socket.off("triaged", triagedHandler);
      socket.off("assigned", assigneddHandler);
      socket.off("locked", lockedConsultationHandler);
      socket.off("out-when-called", outWhenCalledHandler);
      socket.off("follow-up", followUpHandler);
    };
  }, []);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: 230,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header className="bg-blue-600 text-white">
        <Group h="100%" px="md">
          <div className="flex w-full">
            <div className="flex w-[50%] items-center">
              <Burger
                opened={mobileOpened}
                onClick={() => {
                  toggleMobile();
                  toggleDesktop();
                }}
                hiddenFrom="md"
                color="white"
                size="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={() => {
                  toggleMobile();
                  toggleDesktop();
                }}
                visibleFrom="md"
                color="white"
                size="sm"
              />
            </div>
            <div className="flex w-[50%] justify-end">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="transparent"
                    className="text-white hover:text-blue-500 hover:bg-white transition-all ease-in text-start"
                  >
                    <div>
                      <div>
                        {" "}
                        <small style={{ fontSize: 9 }}>
                          Hi {user.role_name.toUpperCase()}!
                        </small>
                      </div>
                      <div className="mt-1">
                        {user.name ? user.name : "Guest"}{" "}
                      </div>
                    </div>
                    <IconUserCircle className="ml-2" />
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item
                    component={NavLink}
                    to="/my-profile"
                    leftSection={
                      <IconUserCog
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    My Profile
                  </Menu.Item>
                  <Menu.Item
                    component={NavLink}
                    to="/change-password"
                    leftSection={
                      <IconPassword
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Change Password
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={logoutHandler}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className="bg-blue-500 text-white">
        <div className="mb-2 w-full">
          <div className="flex justify-between items-center gap-1">
            <div className="flex">
              <img src={logo} width={50} height={50} className="mr-1" />
              <div className="flex flex-col justify-center">
                <span className="text-[20px] font-bold tracking-widest w-full leading-tight">
                  TELEHEALTH
                </span>
                <span className="text-[12.2px]">INFORMATION SYSTEM</span>
              </div>
            </div>

            <div>
              {!desktopOpened && mobileOpened && (
                <ActionIcon onClick={toggleMobile}>
                  <IconX />
                </ActionIcon>
              )}
            </div>
          </div>
        </div>
        <Divider my={5} className="opacity-50" />
        <NavBar />
      </AppShell.Navbar>
      <AppShell.Main style={{ backgroundColor: "#f4f6f9" }}>
        {children}
        <Notifications />
      </AppShell.Main>
    </AppShell>
  );
}

export default DefaultLayout;
