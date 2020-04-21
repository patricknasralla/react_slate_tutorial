import React from "react";
import ReactDOM from "react-dom";

import { StyledFloatingMenu } from "./styles";
import { FloatingMenuItem } from "./FloatingMenuItem";

interface FloatingMenu {
  cursorPosition: DOMRect;
  currentWords: string[];
  onClick: (index: number) => void;
}

export const FloatingMenu: React.FC<FloatingMenu> = ({
  cursorPosition,
  currentWords,
  onClick
}) => {
  return ReactDOM.createPortal(
    <StyledFloatingMenu position={cursorPosition}>
      {currentWords.map((word, index) => (
        <FloatingMenuItem
          key={index + word}
          onClick={() => onClick(index)}
          onMouseOver={() => console.log(`mouseOver: ${index}`)}
        >
          {word}
        </FloatingMenuItem>
      ))}
    </StyledFloatingMenu>,
    document.body
  );
};
