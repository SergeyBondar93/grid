import React, { useState, useRef, useEffect, useCallback } from "react";
import { HeaderCellWrapper } from "./HeaderCell";
import { Header, MovingElem } from "./styleds";


export const HeaderWrapper = ({
  fullWidth,
  translateX,
  columns,
  onChangeWidth,
  onChangeMoving,
  changeIsSelectable
}) => {
  const mappedColumns = useRef(columns);
  const [isMoving, changeIsMoving] = useState(false);
  const clickX = useRef(0);
  const movingColumnIndex = useRef();
  const movingColumnData = useRef(null);
  const movingElemRect = useRef()
  const headerRef = useRef();
  const emptyColumnIndex = useRef(null);
  const [mouseMove, changeMouseMove] = useState(0);
  const [startCoord, changeStartCoord] = useState({ x: 0, y: 0, height: 0 });
  const startClickX = useRef(0);

  useEffect(() => {
    mappedColumns.current = columns;
    changeStartCoord({ x: 0, y: 0, height: 0 });
  }, [columns]);
  const handleMouseMove = useCallback(
    e => {
      const { clientX } = e;
      const moveMouse = clientX - clickX.current;

      if (moveMouse < 0) {
        if (mappedColumns.current[emptyColumnIndex.current - 1]) {
          if (-moveMouse >= mappedColumns.current[emptyColumnIndex.current - 1].width / 2) {
            clickX.current -= mappedColumns.current[emptyColumnIndex.current - 1].width;

            let newMappedColumns = [...mappedColumns.current];

            [newMappedColumns[emptyColumnIndex.current], newMappedColumns[emptyColumnIndex.current - 1]] = [
              newMappedColumns[emptyColumnIndex.current - 1],
              newMappedColumns[emptyColumnIndex.current]
            ];

            mappedColumns.current = newMappedColumns;
            emptyColumnIndex.current = emptyColumnIndex.current - 1;
          }
        }
      } else if (moveMouse > 0) {
        if (mappedColumns.current[emptyColumnIndex.current + 1]) {
          if (moveMouse >= mappedColumns.current[emptyColumnIndex.current + 1].width / 2) {
            clickX.current += mappedColumns.current[emptyColumnIndex.current + 1].width;
            let newMappedColumns = [...mappedColumns.current];

            [newMappedColumns[emptyColumnIndex.current], newMappedColumns[emptyColumnIndex.current + 1]] = [
              newMappedColumns[emptyColumnIndex.current + 1],
              newMappedColumns[emptyColumnIndex.current]
            ];

            mappedColumns.current = newMappedColumns;
            emptyColumnIndex.current = emptyColumnIndex.current + 1;
          }
        }
      }
      changeMouseMove(clientX - startClickX.current);
    },
    [mappedColumns.current, clickX.current]
  );

  const handleMouseUp = () => {
    emptyColumnIndex.current = null;
    changeIsMoving(false);
    changeMouseMove(0);
    onChangeMoving(mappedColumns.current);
    movingColumnIndex.current = 0;
    movingColumnData.current = null;
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    changeIsSelectable(false)
  };

  const handleMouseDown = (e, i) => {
    clickX.current = e.clientX;
    startClickX.current = e.clientX;
    const coords = e.currentTarget.getBoundingClientRect();
    changeStartCoord({
      x: coords.left - headerRef.current.getBoundingClientRect().left,
      y: coords.y,
      height: coords.height
    });
    changeIsMoving(true);
    movingElemRect.current = e.target.getBoundingClientRect();
    movingColumnIndex.current = i;
    emptyColumnIndex.current = i;
    movingColumnData.current = mappedColumns.current[i];
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    changeIsSelectable(true)
  };

  return (
    <Header
      ref={headerRef}
      width={fullWidth}
      translateX={translateX}
    >
      {mappedColumns.current.map((el, index) => (
        <HeaderCellWrapper
          isEmpty={index === emptyColumnIndex.current}
          onMouseDown={handleMouseDown}
          width={mappedColumns.current.length === index + 1 ? el.width + 9 : el.width}
          text={el.headerName}
          onChangeWidth={onChangeWidth}
          index={index}
          changeIsSelectable={changeIsSelectable}
          center={!!el.center}
        />
      ))}
      {isMoving && (
        <MovingElem
          startCoord={startCoord}
          mouseMove={mouseMove}
          width={movingColumnData.current.width}
          center={!!movingColumnData.current.center}
        >
          <span>
            {movingColumnData.current.headerName}
          </span>
        </MovingElem>
      )}
    </Header>
  );
};
