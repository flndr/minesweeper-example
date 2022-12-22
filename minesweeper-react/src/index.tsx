import React    from 'react';
import ReactDOM from 'react-dom/client';

import App from './Components/App';
import '../../minesweeper-vanilla/src/style.css';

ReactDOM.createRoot( document.querySelector<HTMLDivElement>( '[data-board]' )! ).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
