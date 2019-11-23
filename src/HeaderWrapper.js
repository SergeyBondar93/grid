import React, { useState, useRef, useEffect, useCallback } from "react";
import { HeaderCellWrapper } from "./HeaderCell";
import { Header } from "./styleds";

const useForceUpdate = () => useState()[1];

export const HeaderWrapper = ({
  fullWidth,
  translateX,
  columns,
  onChangeWidth,
  onChangeMoving
}) => {
  const mappedColumns = useRef(columns);
  const [isMoving, changeIsMoving] = useState(false);
  const clickX = useRef(0);
  const movingColumnIndex = useRef();
  const movingColumnData = useRef(null);
  const headerRef = useRef();
  const emptyColumn = useRef(null);
  const [mouseMove, changeMouseMove] = useState(0);
  const [startCoord, changeStartCoord] = useState({ x: 0, y: 0 });
  const startClickX = useRef(0);

  useEffect(() => {
    mappedColumns.current = columns;
  }, [columns]);

  const handleMouseMove = useCallback(
    e => {
      const { clientX } = e;
      const movingElem = e.target.getBoundingClientRect();
      const moveMouse = clientX - clickX.current;
      const headerRect = headerRef.current.getBoundingClientRect();
      if (moveMouse < 0) {
        if (movingElem.left <= headerRect.left) return;
        if (mappedColumns.current[emptyColumn.current - 1]) {
          if (
            -moveMouse >= mappedColumns.current[emptyColumn.current - 1].width
          ) {
            clickX.current -=
              mappedColumns.current[emptyColumn.current].width - 1;
            let newMappedColumns = [...mappedColumns.current];
            [
              newMappedColumns[emptyColumn.current],
              newMappedColumns[emptyColumn.current - 1]
            ] = [
              newMappedColumns[emptyColumn.current - 1],
              newMappedColumns[emptyColumn.current]
            ];
            mappedColumns.current = newMappedColumns;
            emptyColumn.current = emptyColumn.current - 1;
          }
        }
      } else if (moveMouse > 0) {
        if (movingElem.right >= headerRect.right) return;
        if (mappedColumns.current[emptyColumn.current + 1]) {
          if (
            moveMouse >= mappedColumns.current[emptyColumn.current + 1].width
          ) {
            console.log(
              moveMouse,
              mappedColumns.current[emptyColumn.current + 1].width
            );
            clickX.current +=
              mappedColumns.current[emptyColumn.current].width + 1;
            let newMappedColumns = [...mappedColumns.current];
            [
              newMappedColumns[emptyColumn.current],
              newMappedColumns[emptyColumn.current + 1]
            ] = [
              newMappedColumns[emptyColumn.current + 1],
              newMappedColumns[emptyColumn.current]
            ];
            mappedColumns.current = newMappedColumns;
            emptyColumn.current = emptyColumn.current + 1;
          }
        }
      }
      changeMouseMove(clientX - startClickX.current);
    },
    [mappedColumns.current, clickX.current]
  );

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

  return (
    <Header
      ref={headerRef}
      style={{
        width: `${fullWidth}px`,
        transform: `translateX(${-translateX}px)`
      }}
    >
      {columns.map((el, index) => (
        <HeaderCellWrapper
          isEmpty={index === emptyColumn.current}
          onMouseDown={handleMouseDown}
          width={el.width}
          text={el.headerName}
          onChangeWidth={onChangeWidth}
          index={index}
          // key={Math.random()}
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
    </Header>
  );
};
