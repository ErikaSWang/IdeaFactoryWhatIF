import React, { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Ideas } from './pages/Ideas';
import './App.css'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={ <Root /> }>
    <Route index element={ <Home /> } />
    <Route path="/ideas" element={ <Ideas /> } />
  </Route>
));

export const App = () => {
  return (
    <main>
      <RouterProvider
        router={ router }
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      />
    </main>
  )
}