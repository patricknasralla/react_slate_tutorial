import React from "react";
import ReactDOM from "react-dom";

import { StyledFloatingMenu } from "./styles";

interface FloatingMenu {
  cursorPosition: DOMRect;
  currentWord: string;
}

export const FloatingMenu: React.FC<FloatingMenu> = ({
  cursorPosition,
  currentWord
}) => {
  return ReactDOM.createPortal(
    <StyledFloatingMenu position={cursorPosition}>
      {currentWord}
    </StyledFloatingMenu>,
    document.body
  );
};
