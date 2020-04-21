import styled from "styled-components";

export const Container = styled.div`
  margin: 2rem auto;
  padding: 0 5rem;
  max-width: 72rem; //80chars
  min-width: 54rem; //60chars
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const EditorStyles = styled.div`
  width: 100%;
  padding: 0 0 45vh 0;
  font-family: "IBM Plex Mono", monospace;
  font-size: 1.5rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.main};
`;
