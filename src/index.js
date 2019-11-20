import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const width = 150

const columns = [
  { width, headerName: "Number row", field: "row" },
  { width, headerName: "Make", field: "make" },
  { width, headerName: "Model", field: "model" },
  { width, headerName: "Price", field: "price" },
  { width, headerName: "Col 1", field: "col1" },
  { width, headerName: "Col 2", field: "col2" },
  { width, headerName: "Col 3", field: "col3" },
  { width, headerName: "Col 4", field: "col4" },
  { width, headerName: "Col 5", field: "col5" },
  { width, headerName: "Col 6", field: "col6" },
  { width, headerName: "Col 7", field: "col7" },
  { width, headerName: "Col 8", field: "col7" },
  { width, headerName: "Col 9", field: "col8" },
  { width, headerName: "Col 10", field: "col10" }
]



export const generateLorem = (n) => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Mauris tristique tortor quam, eget iaculis dolor facilisis vitae. Aenean et blandit sapien. 
    Quisque sed placerat tortor, egestas tincidunt arcu. Quisque ac justo eu lacus imperdiet 
    vestibulum quis egestas ligula. Integer orci nunc, viverra at vehicula vel, iaculis et enim. 
    Cras sagittis eleifend pharetra. Integer odio leo, fermentum sed odio in, faucibus ornare nisi. 
    Morbi urna enim, sollicitudin vel commodo sed, pellentesque in velit. Phasellus aliquet lectus
     eu nunc sollicitudin tempus. Aliquam a turpis eget ex imperdiet ullamcorper vitae id nisi. 
     Donec rhoncus elit sit amet sodales efficitur. Nam iaculis, est et gravida congue, mauris nulla
      pulvinar sem, ac congue dui nisl vitae orci. Aliquam venenatis nunc sit amet dignissim viverra.`
  const words = text.split(' ').slice(0, 100);
  if (n < 100) return words.slice(0, n).join(' ')
  const mult = +String(n / 100).split('.')[0];
  const remains = n % 100;
  const res = [];
  for (let i = 0; i < mult; i++) {
    res.push(text);
  }
  res.push(words.slice(0, remains).join(' '))
  return res.join(' ')
}


const createDublicateRows = (n) => {

  const res = [];
  for (let i = 0; i < n; i++) {
    res.push({
      price: Math.floor(Math.random() * 100000 + 10000),
      make: generateLorem(Math.floor(Math.random() * 40 + 1)),
      model: generateLorem(Math.floor(Math.random() * 10 + 1)),
      col1: generateLorem(Math.floor(Math.random() * 20 + 1)),
      col2: generateLorem(Math.floor(Math.random() * 3 + 1)),
      col3: generateLorem(Math.floor(Math.random() * 5 + 1)),
      col4: generateLorem(Math.floor(Math.random() * 15 + 1)),
      col5: generateLorem(Math.floor(Math.random() * 10 + 1)),
      col6: generateLorem(Math.floor(Math.random() * 15 + 1)),
      col7: generateLorem(Math.floor(Math.random() * 2 + 1)),
      col7: generateLorem(Math.floor(Math.random() * 2 + 1)),
      col8: generateLorem(Math.floor(Math.random() * 0 + 1)),
      col10: generateLorem(Math.floor(Math.random() * 10 + 1)),
      row: i
    })
  }
  return res
}

const rows = createDublicateRows(100)



ReactDOM.render(<App columns={columns} rows={rows} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight} />, document.getElementById('root'));
// ReactDOM.render(<App columns={columns} rows={rows} width={800} height={800} />, document.getElementById('root'));
