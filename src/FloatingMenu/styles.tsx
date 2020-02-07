import styled from "styled-components";

interface StyledFloatingMenu {
  position: DOMRect;
}

interface StyledFloatingMenuItem {
  active?: boolean;
}

export const StyledFloatingMenu = styled.div<StyledFloatingMenu>`
  display: flex; // for future item styling
  flex-direction: column; // for future item styling
  padding: 0;
  position: absolute;
  top: ${({ position }) =>
    position ? position.bottom + window.pageYOffset + 4 : -10000}px;
  left: ${({ position }) =>
    position ? position.left + window.pageXOffset - 5 : -10000}px;
  z-index: 100;
  margin-top: -0.2rem;
  opacity: 0.93;
  font-family: "IBM Plex Mono", monospace;
  font-size: 1.5rem;
  background-color: #f8faf9;
  color: #585f65;
  border: 1px solid #dadddf;
  border-radius: 3px;
`;

export const StyledFloatingMenuItem = styled.div<StyledFloatingMenuItem>`
  transition: background-color 0.05s;
  margin: 0;
  padding: 0.2rem 0.4rem;
  border: none;
  text-align: left;
  font-family: "IBM Plex Mono", monospace;
  font-size: 1.5rem;
  background-color: #f8faf9;
  color: #585f65;
  :focus {
    outline: 0;
  }
  :active {
    outline: none;
    border: none;
    color: #f8faf9;
    background-color: #71787e;
  }
  ${props =>
    props.active &&
    `
    background-color: #DADDDF;
    font-weight: bold;
  `}
`;
