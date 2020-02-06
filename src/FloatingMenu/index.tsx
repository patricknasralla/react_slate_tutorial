import React from "react";
import ReactDOM from "react-dom";

import { StyledFloatingMenu } from "./styles";

interface FloatingMenu {
  cursorPosition: DOMRect;
}

export const FloatingMenu: React.FC<FloatingMenu> = ({ cursorPosition }) => {
  return ReactDOM.createPortal(
    <StyledFloatingMenu position={cursorPosition}>
      Floating Menu!
    </StyledFloatingMenu>,
    document.body
  );
};
