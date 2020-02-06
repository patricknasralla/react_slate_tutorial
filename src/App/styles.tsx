import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const EditorStyles = styled.div`
  margin: 2rem auto;
  max-width: 72rem; //80chars
  min-width: 54rem; //60chars
  padding: 0 0 45vh 0;
  font-family: "IBM Plex Mono", monospace;
  font-size: 1.5rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.main};
`;
