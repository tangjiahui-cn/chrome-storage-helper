import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.min.css';
import App from './pages';
import { popupListen } from '@/data';
import React from 'react';

popupListen();

const mount: HTMLElement = document.getElementById('root') || document.body;
createRoot(mount).render(React.createElement(App));
