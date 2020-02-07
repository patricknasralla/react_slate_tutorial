import React from "react";
import ReactDOM from "react-dom";

import { StyledFloatingMenu } from "./styles";
import { FloatingMenuItem } from "./FloatingMenuItem";

interface FloatingMenu {
  cursorPosition: DOMRect;
  currentWords: string[];
}

export const FloatingMenu: React.FC<FloatingMenu> = ({
  cursorPosition,
  currentWords
}) => {
  return ReactDOM.createPortal(
    <StyledFloatingMenu position={cursorPosition}>
      {currentWords.map((word, index) => (
        <FloatingMenuItem
          key={index + word}
          onClick={() => console.log(`clicked: ${index}`)}
          onMouseOver={() => console.log(`mouseOver: ${index}`)}
        >
          {word}
        </FloatingMenuItem>
      ))}
    </StyledFloatingMenu>,
    document.body
  );
};
