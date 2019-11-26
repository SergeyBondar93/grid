import React, { useState, useRef, useEffect, useCallback } from "react";
import { HeaderCellWrapper } from "./HeaderCell";
import { Header } from "./styleds";

const useForceUpdate = () => useState()[1];

export const HeaderWrapper = ({
  fullWidth,
  translateX,
  columns,
  onChangeWidth,
  onChangeMoving,
  visibleWidth,
  changeTransform
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
  const [startCoord, changeStartCoord] = useState({ x: 0, y: 0 });
  const startClickX = useRef(0);

  useEffect(() => {
    mappedColumns.current = columns;
    changeStartCoord({ x: 0, y: 0 });
  }, [columns]);

  const handleMouseMove = useCallback(
    e => {
      const { clientX } = e;
      const moveMouse = clientX - clickX.current;

      const headerRect = headerRef.current.getBoundingClientRect();

      if (moveMouse < 0) {
        if (movingElemRect.current.left <= headerRect.left) return;
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
        if (movingElemRect.current.right >= headerRect.right) return;
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

  const handleMouseUp = e => {
    changeIsMoving(false);
    changeMouseMove(0);
    emptyColumnIndex.current = null;
    // changeStartCoord({ x: 0, y: 0 });
    onChangeMoving(mappedColumns.current);
    movingColumnIndex.current = 0;
    movingColumnData.current = null;
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
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
    movingElemRect.current = e.target.getBoundingClientRect();
    movingColumnIndex.current = i;
    emptyColumnIndex.current = i;
    movingColumnData.current = mappedColumns.current[i];
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };

  return (
    <Header
      ref={headerRef}
      style={{
        width: ` calc(${fullWidth}px + 100%)`,
        transform: `translateX(${-translateX}px)`
      }}
    >
      {mappedColumns.current.map((el, index) => (
        <HeaderCellWrapper
          isEmpty={index === emptyColumnIndex.current}
          onMouseDown={handleMouseDown}
          width={el.width}
          text={el.headerName}
          onChangeWidth={onChangeWidth}
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
    </Header>
  );
};
