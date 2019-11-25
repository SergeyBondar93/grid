import React, { useRef, useCallback, useState, useEffect } from "react";
import { RightBorder, HeaderCell } from "./styleds";

export const HeaderCellWrapper = ({ text, headerRef, fullWidth, width, onChangeWidth, onResize, index, onMouseDown, isEmpty }) => {
  const [newWidth, changeNewWidth] = useState(width);
  const clickX = useRef(0);
  const widthRef = useRef(width);

  useEffect(() => {
    changeNewWidth(width);
  }, [width]);

  const handleMouseMove = useCallback(e => {
    const { clientX: currentX } = e;
    const calcNewWidth = width + (currentX - clickX.current);

    const headerRect = headerRef.current.getBoundingClientRect();
    if (currentX - headerRect.left >= fullWidth - 30) return;

    if (calcNewWidth >= 1600) return;
    else if (calcNewWidth <= 30) {
      changeNewWidth(30);
      onResize(index, 30);
      widthRef.current = 30;
    } else {
      changeNewWidth(calcNewWidth);
      onResize(index,calcNewWidth);
      widthRef.current = calcNewWidth;
    }
  }, [fullWidth, headerRef, index, onResize, width]);

  const handleMouseUp = useCallback(e => {
    onChangeWidth(index, widthRef.current);
    document.body.removeEventListener("mouseup", handleMouseUp);
    document.body.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, index, onChangeWidth]);

  const handleMouseDown = useCallback(e => {
    clickX.current = e.clientX;
    document.body.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, handleMouseUp]);

  return (
    <HeaderCell style={{ width: `${newWidth}px` }}>
      <div
        style={{
          width: "calc(100% - 6px)",
          overflow: "hidden",
          height: "38px" /* решить как то растягивание на 100% высоты */,
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
