/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { StoreProvider } from './store';
import { Router, hashIntegration } from '@solidjs/router';

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
  }

render(() => <StoreProvider><Router source={hashIntegration()}><App /></Router></StoreProvider>, root!)


