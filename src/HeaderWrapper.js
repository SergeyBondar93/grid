import React, { useState, useRef, useEffect, useCallback } from "react";
import {setIn} from "utilitify";

import { HeaderCellWrapper } from "./HeaderCell";
import { Header } from "./styles";


export const HeaderWrapper = ({
  fullWidth,
  translateX,
  columns,
  onChangeWidth,
  onChangeMoving,
  visibleWidth,
  changeTransform
}) => {
  const clickX = useRef(0);
  const movingColumnIndex = useRef();
  const movingColumnData = useRef(null);
  const headerRef = useRef();
  const emptyColumn = useRef(null);
  const mappedColumns = useRef(columns);

  const [draggableColumns, setDraggableColumns] = useState(columns);
  const [isMoving, changeIsMoving] = useState(false);
  const [mouseMove, changeMouseMove] = useState(0);
  const [startCoord, changeStartCoord] = useState({ x: 0, y: 0 });
  const [tempWidth, setTempWidth] = useState(fullWidth);
  const startClickX = useRef(0);

  useEffect(() => {
    mappedColumns.current = columns;
    setDraggableColumns(columns);
  }, [columns]);

  useEffect(() => {
    setTempWidth(fullWidth);
  }, [fullWidth]);

  const handleMouseMove = useCallback(e => {
    const { clientX } = e;
    const moveMouse = clientX - clickX.current;

    const headerRect = headerRef.current.getBoundingClientRect();
    const movingElem = e.target.getBoundingClientRect();

    if (moveMouse < 0) {
      if (movingElem.left <= headerRect.left) return;

      const leftColumnIndex = emptyColumn.current - 1;

      if (mappedColumns.current[leftColumnIndex]) {
        if (Math.abs(moveMouse) >= mappedColumns.current[leftColumnIndex].width / 2) {
          clickX.current -= mappedColumns.current[leftColumnIndex].width;

          const newMappedColumns = [...mappedColumns.current];

          [
            newMappedColumns[emptyColumn.current],
            newMappedColumns[leftColumnIndex]
          ] = [
            newMappedColumns[leftColumnIndex],
            newMappedColumns[emptyColumn.current]
          ];

          emptyColumn.current = leftColumnIndex;
          mappedColumns.current = newMappedColumns;
          setDraggableColumns(newMappedColumns);
        }
      }
    } else if (moveMouse > 0) {
      if (movingElem.right >= headerRect.right) return;

      const rightColumnIndex = emptyColumn.current + 1;

      if (mappedColumns.current[rightColumnIndex]) {
        if (moveMouse >= mappedColumns.current[rightColumnIndex].width / 2) {
          clickX.current += mappedColumns.current[rightColumnIndex].width;
          const newMappedColumns = [...mappedColumns.current];

          [
            newMappedColumns[emptyColumn.current],
            newMappedColumns[rightColumnIndex]
          ] = [
            newMappedColumns[rightColumnIndex],
            newMappedColumns[emptyColumn.current]
          ];

          emptyColumn.current = rightColumnIndex;
          mappedColumns.current = newMappedColumns;
          setDraggableColumns(newMappedColumns);
        }
      }
    }

    changeMouseMove(clientX - startClickX.current);
  }, []);

  const handleMouseUp = e => {
    changeIsMoving(false);
    changeMouseMove(0);
    emptyColumn.current = null;
    changeStartCoord({ x: 0, y: 0 });
    onChangeMoving(mappedColumns.current);
    movingColumnIndex.current = 0;
    movingColumnData.current = null;
    document.body.removeEventListener("mouseup", handleMouseUp);
    document.body.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseDown = (e, i) => {
    clickX.current = e.clientX;
    startClickX.current = e.clientX;
    const coords = e.target.getBoundingClientRect();
    changeStartCoord({
      x: coords.left - headerRef.current.getBoundingClientRect().left,
      y: coords.y,
      height: coords.height
    });
    changeIsMoving(true);
    movingColumnIndex.current = i;
    emptyColumn.current = i;
    movingColumnData.current = mappedColumns.current[i];
    document.body.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mousemove", handleMouseMove);
  };

  const handleColumnResize = (index, width) => {
    const newColumns = setIn(draggableColumns, width, [index, "width"]);
    const tempWidth = newColumns.reduce((acc, { width }) => (acc += width), 0);
    setTempWidth(tempWidth);
  };

  return (
    <Header
      ref={headerRef}
      style={{
        width: `${fullWidth}px`,
        transform: `translateX(${-translateX}px)`
      }}
    >
      <div style={{width: `${tempWidth}px`}}>
        {draggableColumns.map((el, index) => (
          <HeaderCellWrapper
            key={index}
            isEmpty={index === emptyColumn.current}
            onMouseDown={handleMouseDown}
            headerRef={headerRef}
            fullWidth={fullWidth}
            width={el.width}
            text={el.headerName}
            onChangeWidth={onChangeWidth}
            onResize={handleColumnResize}
            index={index}
          />
        ))}

        {isMoving && (
          <div
            style={{
              position: "absolute",
              left: `${startCoord.x}px`,
              top: `${startCoord.y}px`,
              transform: `translateX(${mouseMove}px)`,
              width: `${movingColumnData.current.width}px`,
              outline: "1px solid black",
              height: `${startCoord.height}px`
            }}
          >
            {movingColumnData.current.headerName}
          </div>
        )}
      </div>
    </Header>
  );
};
