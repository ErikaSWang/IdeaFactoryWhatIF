import React, { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import './App.css'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={ <Root /> }>
    <Route index element={ <Home /> } />
    <Route path="/events" element={ <Events /> } />
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