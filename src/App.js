import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, HeaderCell, Body, BodyCell, RightBorder, AntiSelect } from "./styleds";
import { Grid } from 'react-virtualized';
import { generateLorem } from '.';

const HeaderCellWrapper = ({ text, width, onChangeWidth, index }) => {
  const [newWidth, changeNewWidth] = useState(width)
  // const newWidth = useRef(width)
  let clickX = 0;
  // const [antiSelectLayer, changeAntiSelectLayer] = useState(false)
  // console.log(clickX)


  const handleMouseMove =
    useCallback(
      (e) => {
        const { clientX: currentX } = e;
        const calcNewWidth = width + (currentX - clickX);
        console.log(width)

        if (calcNewWidth >= 1600) return;
        else if (calcNewWidth <= 30) {
          changeNewWidth(30);
        } else {
          changeNewWidth(calcNewWidth);
        }
      }
      ,
      [width, clickX],
    );


  const handleRemoveMouseMove =
    useCallback(
      () => {
        onChangeWidth(index, newWidth);
        document.body.removeEventListener('mousemove', handleMouseMove);
      }
      , [handleMouseMove, index, newWidth, onChangeWidth]);


  const handleMouseDown =
    useCallback(
      (e) => {
        clickX = e.clientX;

        document.body.addEventListener('mouseup', () => {
          handleRemoveMouseMove()
        });
        document.body.addEventListener('mousemove', handleMouseMove);
      }
      ,
      [handleMouseMove, newWidth],
    );
  return (
    <HeaderCell style={{ width: `${newWidth}px` }} >
      <span >
        {text}
      </span>
      <RightBorder onMouseDown={handleMouseDown} onMouseUp={handleRemoveMouseMove} />
      {/* {antiSelectLayer && <AntiSelect> {generateLorem(500)} </AntiSelect>} */}
    </HeaderCell>
  )
}


const HeaderWrapper = ({ fullWidth, translateX, columns, onChangeWidth }) => {

  return <Header style={{ width: `${fullWidth}px`, transform: `translateX(${-translateX}px)` }} >
    {columns.map((el, index) => <HeaderCellWrapper width={el.width} text={el.headerName} onChangeWidth={onChangeWidth} index={index} />)}
  </Header>
}



const App = ({ rows, columns, width, height }) => {
  const [mappedColumns, changeMappedColumns] = useState({ columns, fullWidth: columns.reduce((acc, { width }) => acc += width, 0) });
  const [scrollLeft, changeScrollLeft] = useState(0);
  const gridRef = useRef();


  const handleScroll = e => {
    changeScrollLeft(e.scrollLeft)
  }
  const cell = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <BodyCell tabIndex={0} key={key} style={style}>
        <span>
          {rows[rowIndex][columns[columnIndex].field]}
        </span>
      </BodyCell>
    )
  }

  const handleChangeWidth = useCallback((index, width) => {
    const newColumns = [...mappedColumns.columns];
    const newColumn = { ...newColumns[index], width };
    newColumns[index] = newColumn;
    /* вот тут выявляется проблема, даже 2 
      1) каждое перетаскивание добавляет 1 вызов этой функции, то есть она срабатывает не 1 раз
      2) каждый раз почему то mappedColumns.columns является массивом колонок который изначально пришёл, 
      то есть мы делаем изменения состояние не как 1 - 2, 2 - 3, 3 - 4, 4 - 5 
      а делается вот так 1 - 2, 1 - 3, 1 - 4, 1 - 5
      то есть прошлые наши изменения сбрасываются.   
      из за вот этого может показаться что логика перетягивания работает не верно, но в ней вроде проблем нет
      но это не точно
      */
    console.log(newColumns)
    changeMappedColumns({ columns: newColumns, fullWidth: newColumns.reduce((acc, { width }) => acc += width, 0) });
  }, [mappedColumns])


  useEffect(() => {
    if (gridRef.current) gridRef.current.recomputeGridSize();
  }, [mappedColumns])

  return (
    <div style={{ width: `${width}px`, overflow: 'hidden' }} >
      <HeaderWrapper fullWidth={mappedColumns.fullWidth} columns={mappedColumns.columns} translateX={scrollLeft} onChangeWidth={handleChangeWidth}  ></HeaderWrapper>
      <Body>
        <Grid
          ref={gridRef}
          cellRenderer={cell}
          columnWidth={({ index }) => mappedColumns.columns[index].width}
          columnCount={mappedColumns.columns.length}
          height={height}
          rowHeight={40}
          rowCount={rows.length}
          width={width}
          onScroll={handleScroll}
        />
      </Body>
    </div>
  )
}


export default App;
