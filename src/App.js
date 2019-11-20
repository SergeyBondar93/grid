import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, HeaderCell, Body, BodyCell, RightBorder, AntiSelect } from "./styleds";
import { Grid } from 'react-virtualized';
import { setIn } from 'utilitify'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';


const HeaderCellWrapper = ({ text, width, onChangeWidth, index }) => {
  const [newWidth, changeNewWidth] = useState(width)
  const clickX = useRef(0);
  const widthRef = useRef(width)

  const handleMouseMove =
    useCallback(
      (e) => {
        const { clientX: currentX } = e;
        const calcNewWidth = width + (currentX - clickX.current);
        if (calcNewWidth >= 1600) return;
        else if (calcNewWidth <= 30) {
          changeNewWidth(30);
          widthRef.current = 30
        } else {
          changeNewWidth(calcNewWidth);
          widthRef.current = calcNewWidth
        }
      },
      [width, clickX.current],
    );



  const handleMouseUp =
    useCallback(
      (e) => {
        onChangeWidth(index, widthRef.current);
        document.body.removeEventListener('mouseup', handleMouseUp);
        document.body.removeEventListener('mousemove', handleMouseMove);
      }
      , [handleMouseMove, index, newWidth, onChangeWidth]);


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
      <RightBorder onMouseDown={handleMouseDown} />
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
  const [mappedRows, changeMappedRows] = useState(rows);

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

  const onChangeExpand = useCallback((index, childrens) => {
    if (mappedRows[index].isExpand) {
      const newMappedRows = [...mappedRows.slice(0, index + 1), ...mappedRows.slice(index + 1 + childrens.length)];
      const withNewExpand = setIn(newMappedRows, false, [index, 'isExpand'])
      changeMappedRows(withNewExpand)
    } else {
      const newMappedRows = [...mappedRows.slice(0, index + 1), ...childrens, ...mappedRows.slice(index + 1)];
      const withNewExpand = setIn(newMappedRows, true, [index, 'isExpand'])
      changeMappedRows(withNewExpand)
    }
  })


  const cell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const content = mappedRows[rowIndex][mappedColumns[columnIndex].field]

    const isExpandable = columns[columnIndex].isExpandable;
    const handleExpand = () => {

      onChangeExpand(rowIndex, mappedRows[rowIndex].children)
    }

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <BodyCell tabIndex={0} key={key} style={{ ...style, width: mappedColumns[columnIndex].width }}>
          {isExpandable && mappedRows[rowIndex].children ? <button onClick={handleExpand} >{mappedRows[rowIndex].isExpand ? '-' : '+'}</button> : null}
          <span>
            {content}
          </span>
        </BodyCell>
      </CellMeasurer>
    )
  }

  const handleChangeWidth = useCallback((index, width) => {
    const newColumns = setIn(mappedColumns, width, [index, 'width'])
    changeMappedColumns(newColumns);
    fullWidth.current = newColumns.reduce((acc, { width }) => acc += width, 0)
  }, [mappedColumns])


  useEffect(() => {
    if (gridRef.current) gridRef.current.recomputeGridSize();
    if (cache.current) cache.current.clearAll();
  }, [mappedColumns, mappedRows])

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
          cellRenderer={cell}
          rowCount={mappedRows.length}
          rowHeight={cache.current.rowHeight}
          width={width}
          onScroll={handleScroll}
        />
      </Body>
    </div>
  )
}


export default App;
