import React from "react";
import ReactDOM from "react-dom";

import { StyledFloatingMenu } from "./styles";
import { FloatingMenuItem } from "./FloatingMenuItem";

interface FloatingMenu {
  cursorPosition: DOMRect;
  currentWords: string[];
  menuIndex: number;
  onClick: (index: number) => void;
  onMouseOver: (index: number) => void;
}

export const FloatingMenu: React.FC<FloatingMenu> = ({
  cursorPosition,
  currentWords,
  menuIndex,
  onClick,
  onMouseOver
}) => {
  return ReactDOM.createPortal(
    <StyledFloatingMenu position={cursorPosition}>
      {currentWords.map((word, index) => (
        <FloatingMenuItem
          key={index + word}
          onClick={() => onClick(index)}
          onMouseOver={() => onMouseOver(index)}
          active={index === menuIndex}
        >
          {word}
        </FloatingMenuItem>
      ))}
    </StyledFloatingMenu>,
    document.body
  );
};
