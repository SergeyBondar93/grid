import styled from "styled-components";

export const Header = styled.div`
  /* display: flex; */
  height: 39px;
  overflow: hidden;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

export const Body = styled.div`
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;
export const Row = styled.div`
  display: flex;
`;
export const BodyCell = styled.div`
  border: 1px solid black;
  display: flex;
  align-items: center;
  span {
    margin: 10px;
    display: inline-block;
    overflow: hidden;
  }
  button {
    margin: 10px;
  }
`;
export const HeaderCell = styled.div`
  outline: 1px solid black;
  /* padding: 10px 0; */
  float: left;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  span {
    margin: 10px;
    display: inline-block;
  }
`;

export const RightBorder = styled.div`
  /* float: right; */
  border: 1px solid black;
  height: 38px;
  min-width: 6px;
  /* flex: 10 3 6px; */
  position: relative;
  z-index: 9999999;
  cursor: w-resize;
`;

export const AntiSelect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  background-color: rgba(255, 0, 0, 0.5);
`;
