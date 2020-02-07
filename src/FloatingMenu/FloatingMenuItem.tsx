import React from "react";

import { StyledFloatingMenuItem } from "./styles";

interface FloatingMenuItem {
  onClick: () => void;
  onMouseOver: () => void;
  active?: boolean;
}

export const FloatingMenuItem: React.FC<FloatingMenuItem> = ({
  active,
  onClick,
  onMouseOver,
  children
}) => (
  <StyledFloatingMenuItem
    active={active}
    onMouseOver={onMouseOver}
    onClick={onClick}
  >
    {children}
  </StyledFloatingMenuItem>
);
