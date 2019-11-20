import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, HeaderCell, Body, BodyCell, RightBorder, AntiSelect } from "./styleds";
import { Grid } from 'react-virtualized';
import { setIn } from 'utilitify'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';


const HeaderCellWrapper = ({ text, width, onChangeWidth, index }) => {
  const [newWidth, changeNewWidth] = useState(width)
  const clickX = useRef(0);


  const handleMouseMove =
    useCallback(
      (e) => {

        const { clientX: currentX } = e;
        const calcNewWidth = width + (currentX - clickX.current);

        if (calcNewWidth >= 1600) return;
        else if (calcNewWidth <= 30) {
          changeNewWidth(30);
        } else {
          changeNewWidth(calcNewWidth);
        }
      }
      ,
      [width, clickX.current],
    );


  // const handleRemoveMouseMove =
  //   useCallback(
  //     () => {
  //       onChangeWidth(index, newWidth);
  //       document.body.removeEventListener('mousemove', handleMouseMove);
  //     }
  //     ,
  //     [handleMouseMove, index, newWidth, onChangeWidth]
  //   );
  // console.log('ВНЕ ФУНКЦИИ', newWidth, 'индекс колонки - ', index);


  const handleMouseUp =
    // useCallback(

    (e) => {
      // console.log('handleMouseUp', newWidth, 'индекс в функции - ', index);
      onChangeWidth(index, newWidth);
      document.body.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mousemove', handleMouseMove);
    }
  // , [handleMouseMove, index, newWidth, onChangeWidth]);


  const handleMouseDown =
    useCallback(
      (e) => {
        clickX.current = e.clientX;
        document.body.addEventListener('mouseup', handleMouseUp)
        document.body.addEventListener('mousemove', handleMouseMove);
      }
      ,
      [handleMouseMove, index, newWidth, onChangeWidth],
    );


  return (
    <HeaderCell style={{ width: `${newWidth}px` }} >
      <span >
        {text}
      </span>
      <RightBorder onMouseDown={handleMouseDown} /*onMouseUp={handleRemoveMouseMove}*/ />
    </HeaderCell>
  )
}


const HeaderWrapper = ({ fullWidth, translateX, columns, onChangeWidth }) => {
  return <Header style={{ width: `${fullWidth}px`, transform: `translateX(${-translateX}px)` }} >
    {columns.map((el, index) => <HeaderCellWrapper width={el.width} text={el.headerName} onChangeWidth={onChangeWidth} index={index} />)}
  </Header>
}






const App = ({ rows, columns, width, height }) => {
  const [mappedColumns, changeMappedColumns] = useState(columns);
  const fullWidth = useRef(mappedColumns.reduce((acc, { width }) => acc += width, 0))
  const [scrollLeft, changeScrollLeft] = useState(0);
  const gridRef = useRef();
  const cache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  }))

  const handleScroll = e => {
    changeScrollLeft(e.scrollLeft)
  }
  const cell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const content = rows[rowIndex][mappedColumns[columnIndex].field]

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <BodyCell tabIndex={0} key={key} style={{ ...style, width: mappedColumns[columnIndex].width }}>
          <span>
            {content}
          </span>
        </BodyCell>
      </CellMeasurer>
    )
  }

  const handleChangeWidth = useCallback((index, width) => {
    const newColumns = setIn(mappedColumns, width, [index, 'width'])
    console.log(index, width)
    console.log(newColumns)
    changeMappedColumns(newColumns);
    fullWidth.current = newColumns.reduce((acc, { width }) => acc += width, 0)
  }, [mappedColumns])


  useEffect(() => {
    if (gridRef.current) gridRef.current.recomputeGridSize();
    if (cache.current) cache.current.clearAll();
  }, [mappedColumns])

  return (
    <div style={{ width: `${width}px`, overflow: 'hidden' }} >
      <HeaderWrapper fullWidth={fullWidth.current} columns={mappedColumns} translateX={scrollLeft} onChangeWidth={handleChangeWidth} />
      <Body>
        <Grid
          ref={gridRef}
          columnCount={mappedColumns.length}
          columnWidth={({ index }) => mappedColumns[index].width}
          deferredMeasurementCache={cache.current}
          height={height}
          // overscanColumnCount={0}
          // overscanRowCount={2}
          cellRenderer={cell}
          rowCount={rows.length}
          rowHeight={cache.current.rowHeight}
          width={width}
          onScroll={handleScroll}
        />
      </Body>
    </div>
  )
}


export default App;
