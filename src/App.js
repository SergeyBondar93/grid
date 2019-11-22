import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, HeaderCell, Body, BodyCell, RightBorder, AntiSelect } from "./styleds";
import { Grid } from 'react-virtualized';
import { setIn } from 'utilitify'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';


const HeaderCellWrapper = ({ text, width, onChangeWidth, index, onMouseDown, isEmpty }) => {
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
      <div style={{ width: '100%', height: '100%', backgroundColor: isEmpty ? 'lightblue' : 'yellow' }} onMouseDown={(e) => onMouseDown(e, index)} >
        <span >

          {isEmpty ? null : text}
        </span>
      </div>
      <RightBorder onMouseDown={handleMouseDown} />
    </HeaderCell>
  )
}

const HeaderWrapper = ({ fullWidth, translateX, columns, onChangeWidth, onChangeMoving }) => {
  const mappedColumns = useRef(columns)
  const [isMoving, changeIsMoving] = useState(false)
  const clickX = useRef(0);
  const movingColumnIndex = useRef();
  const movingColumnData = useRef(null);
  const headerRef = useRef();
  const emptyColumn = useRef(null);
  const [mouseMove, changeMouseMove] = useState(0);
  const [startCoord, changeStartCoord] = useState(0)
  const startClickX = useRef(0)


  const handleMouseMove = (e) => {
    const { clientX } = e
    const movingElem = e.target.getBoundingClientRect();
    const moveMouse = clientX - clickX.current;
    const headerRect = headerRef.current.getBoundingClientRect();
    if (moveMouse < 0) {

      if (movingElem.left <= headerRect.left) return
      if (columns[emptyColumn.current - 1]) {
        if (-moveMouse >= (columns[emptyColumn.current - 1].width)) {
          clickX.current -= columns[emptyColumn.current].width
          let newMappedColumns = [...mappedColumns.current];
          [newMappedColumns[emptyColumn.current], newMappedColumns[emptyColumn.current - 1]] = [newMappedColumns[emptyColumn.current - 1], newMappedColumns[emptyColumn.current]]
          mappedColumns.current = newMappedColumns
          emptyColumn.current = emptyColumn.current - 1;
        }
      }
    } else if (moveMouse > 0) {
      if (movingElem.right >= headerRect.right) return
      if (columns[emptyColumn.current + 1]) {

        if (moveMouse >= (columns[emptyColumn.current + 1].width)) {
          clickX.current += columns[emptyColumn.current].width
          let newMappedColumns = [...mappedColumns.current];
          [newMappedColumns[emptyColumn.current], newMappedColumns[emptyColumn.current + 1]] = [newMappedColumns[emptyColumn.current + 1], newMappedColumns[emptyColumn.current]]
          mappedColumns.current = newMappedColumns
          emptyColumn.current = emptyColumn.current + 1;
        }



      }
    }
    changeMouseMove(clientX - startClickX.current)

  }


  const handleMouseUp = (e) => {
    changeIsMoving(false)
    changeMouseMove(0);
    emptyColumn.current = null
    changeStartCoord(0);
    onChangeMoving(mappedColumns.current)
    movingColumnIndex.current = 0;
    movingColumnData.current = null
    document.body.removeEventListener('mouseup', handleMouseUp);
    document.body.removeEventListener('mousemove', handleMouseMove);
  };


  const handleMouseDown = (e, i) => {
    clickX.current = e.clientX;
    startClickX.current = e.clientX
    const coords = e.target.getBoundingClientRect();
    changeStartCoord(coords.left - headerRef.current.getBoundingClientRect().left);
    changeIsMoving(true);
    movingColumnIndex.current = i;
    emptyColumn.current = i;
    movingColumnData.current = mappedColumns.current[i];
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);
  }


  return <Header ref={headerRef} style={{ width: `${fullWidth}px`, transform: `translateX(${-translateX}px)` }} >
    {columns.map((el, index) => <HeaderCellWrapper isEmpty={index === emptyColumn.current} onMouseDown={handleMouseDown} width={el.width} text={el.headerName} onChangeWidth={onChangeWidth} index={index} />)}
    {isMoving &&
      <div
        style={{
          position: "relative",
          left: `${startCoord}px`,
          transform: `translateX(${mouseMove}px)`,
          width: `${movingColumnData.current.width}px`,
          height: '50px',
          outline: '1px solid black'
        }}
      >
        {movingColumnData.current.headerName}
      </div>}
  </Header>
}

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};


// select = multi | one | false
const addOrDeleteItemFromArray = (array, item) => {
  if (array.some(el => el === item)) return array.filter(el => el !== item);
  return [...array, item];
};



const App = ({ rows, columns, width, height, select = 'one' }) => {
  const [mappedColumns, changeMappedColumns] = useState(columns);
  const [mappedRows, changeMappedRows] = useState(rows.map(el => ({ ...el, key: guid() })));
  const [selectedRows, changeSelectedRows] = useState([])
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
      let childrensLength = 0;
      for (let i = index + 1; i < mappedRows.length; i++) {
        if (mappedRows[i].expandLevel) childrensLength++
        else break
      }
      const newMappedRows = [...mappedRows.slice(0, index + 1), ...mappedRows.slice(index + 1 + childrensLength)];
      const withNewExpand = setIn(newMappedRows, false, [index, 'isExpand'])
      changeMappedRows(withNewExpand)
    } else {
      const parentExpandLevel = mappedRows[index].expandLevel || 0
      const newChildrens = childrens.map(el => ({ ...el, expandLevel: parentExpandLevel + 1, key: guid() }))
      const newMappedRows = [...mappedRows.slice(0, index + 1), ...newChildrens, ...mappedRows.slice(index + 1)];
      const withNewExpand = setIn(newMappedRows, true, [index, 'isExpand'])
      changeMappedRows(withNewExpand)
    }
  })




  const handleSelect = (e, key) => {
    if (e.target.tagName === 'BUTTON') return

    if (select === 'multi') changeSelectedRows(addOrDeleteItemFromArray(selectedRows, key));
    if (select === 'one') selectedRows[0] === key ? changeSelectedRows([]) : changeSelectedRows([key]);
  }

  const cell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const content = mappedRows[rowIndex][mappedColumns[columnIndex].field]
    const expandLevel = !columnIndex && mappedRows[rowIndex].expandLevel || 0;
    const isExpandable = mappedColumns[columnIndex].isExpandable;

    const handleExpand = (e) => {
      onChangeExpand(rowIndex, mappedRows[rowIndex].children)
    };

    const checkSelected = () => {
      if (selectedRows.some(key => key === mappedRows[rowIndex].key)) return 'lightblue';
      return
    }

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <BodyCell onClick={(e) => handleSelect(e, mappedRows[rowIndex].key)} key={key} style={{ ...style, backgroundColor: checkSelected(), width: mappedColumns[columnIndex].width }}>
          <div style={{ width: `${expandLevel * 20}px`, height: '20px', backgroundColor: 'red' }} />
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

  const handleChangeMoving = useCallback(newColumns => {
    changeMappedColumns(newColumns)
  }, [])

  useEffect(() => {
    if (gridRef.current) gridRef.current.recomputeGridSize();
    if (cache.current) cache.current.clearAll();
  }, [mappedColumns, mappedRows]);


  console.log(mappedColumns)
  return (
    <div style={{ width: `${width}px`, overflow: 'hidden' }} >
      <HeaderWrapper fullWidth={fullWidth.current} columns={mappedColumns} translateX={scrollLeft} onChangeWidth={handleChangeWidth} onChangeMoving={handleChangeMoving} />
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
