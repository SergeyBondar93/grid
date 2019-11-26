import React, { useRef, useCallback, useState, useEffect } from "react";
import { RightBorder, HeaderCell } from "./styleds";

export const HeaderCellWrapper = ({ text, width, onChangeWidth, index, onMouseDown, isEmpty }) => {
  const [newWidth, changeNewWidth] = useState(width);
  const clickX = useRef(0);
  const widthRef = useRef(width);

  useEffect(() => {
    changeNewWidth(width);
  }, [width]);

  const handleMouseMove = useCallback(
    e => {
      const { clientX: currentX } = e;
      const calcNewWidth = width + (currentX - clickX.current);
      if (calcNewWidth >= 1600) return;
      else if (calcNewWidth <= 30) {
        changeNewWidth(30);
        widthRef.current = 30;
      } else {
        changeNewWidth(calcNewWidth);
        widthRef.current = calcNewWidth;
      }
    },
    [width, clickX.current]
  );

  const handleMouseUp = useCallback(
    e => {
      onChangeWidth(index, widthRef.current);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    },
    [handleMouseMove, index, newWidth, onChangeWidth]
  );

  const handleMouseDown = useCallback(
    e => {
      clickX.current = e.clientX;
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);
    },
    [handleMouseMove, index, newWidth, onChangeWidth]
  );

  return (
    <HeaderCell style={{ width: `${newWidth}px` }}>
      <div
        style={{
          width: "calc(100% - 6px)",
          overflow: "hidden",
          backgroundColor: isEmpty ? "lightblue" : "yellow"
        }}
        onMouseDown={e => onMouseDown(e, index)}
      >
        <span>{isEmpty ? null : text}</span>
      </div>
      <RightBorder onMouseDown={handleMouseDown} />
    </HeaderCell>
  );
};
