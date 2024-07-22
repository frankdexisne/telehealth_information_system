import { NavLink as NavLinkRouter, useLocation } from "react-router-dom";
import NavItemProps from "../interfaces/NavItemProps";
import { NavLink } from "@mantine/core";
import navigations from "../navigations";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ADMINISTRATOR } from "../interfaces/RoleList";

const NavItem = (props: NavItemProps): JSX.Element => {
  const LeftIconComponent = props.lefticon;
  const location = useLocation();
  const isActive = location.pathname === props.to;

  return (
    <NavLink
      className={`hover:text-blue-500 hover:rounded-md transition-all ease-in-out duration-300 my-[1px] ${
        isActive ? "bg-white text-blue-500 rounded-md" : ""
      }`}
      label={<h5 className="text-sm">{props.label}</h5>}
      to={props.to}
      component={NavLinkRouter}
      leftSection={<LeftIconComponent size="1rem" stroke={1.5} />}
    />
  );
};

const NavBar = () => {
  const role = useSelector((state: RootState) => state.auth.user.role_name);
  const permissionLists = useSelector(
    (state: RootState) => state.auth.permissions
  );

  return (
    <Fragment>
      {navigations.map(
        ({ roles, permissions, ...rest }: NavItemProps, index: number) => {
          if (
            role === ADMINISTRATOR ||
            roles?.includes(role) ||
            permissions?.some((permission) =>
              permissionLists?.includes(permission)
            )
          ) {
            return <NavItem key={index} {...rest} />;
          }

          return (
            <Fragment key={index}>
              {!permissions && !roles && <NavItem {...rest} />}
            </Fragment>
          );
        }
      )}
    </Fragment>
  );
};

export default NavBar;
