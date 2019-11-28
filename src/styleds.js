import styled from "styled-components";

export const Header = styled.div.attrs(({ translateX }) => ({
  style: {
    transform: `translateX(${translateX}px)`
  }
}))`
  height: 39px;
  overflow: hidden;
  width: ${({ width }) => `calc(${width}px + 100%)`};
`;

export const Body = styled.div`
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
  }
  button {
    margin: 10px;
  }
`;
export const HeaderCell = styled.div`
  outline: 1px solid black;
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
  border: 1px solid black;
  height: 38px;
  min-width: 6px;
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


export const BodyCellContent = styled.div`
  width: ${({ expandLevel }) => `calc(100% - ${expandLevel * 20}px)`}; 
`;


export const BodyCellOffset = styled.div`
  width: ${({ expandLevel }) => `${expandLevel * 20}px`};
`
export const ExpandButtonWrapper = styled.div`
  width: 16px;
  height: 16px;
  border: none;
  outline: none;
  margin-left: 5px ;
`
export const Wrapper = styled.div`
  width: ${({ width }) => `${width}px`} ;
  overflow: hidden;
  ${({ isSelectable }) => isSelectable && `
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    `
  }

`


export const HeaderCellContent = styled.div`
  width: calc(100% - 6px);
  overflow: hidden;
  background-color: ${({ isEmpty }) => isEmpty ? "lightblue" : "yellow"};
`

export const AntiSelectLayer = styled.div``;

export const MovingElem = styled(HeaderCell).attrs(({ mouseMove }) => ({
  style: {
    transform: `translateX(${mouseMove}px)`
  }
}))`
  position: absolute;
  left: ${({ startCoord: { x } }) => `${x}px`};
  top: ${({ startCoord: { y } }) => `${y}px`};
  width: ${({ width }) => `${width}px`};
  outline: "1px solid black";
  z-index: 9999999999999999999999999999999999999999999999999999;
  height: ${ ({ startCoord: { height } }) => `${height}px`};
`


