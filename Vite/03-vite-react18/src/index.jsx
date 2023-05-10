import React from 'react'
import { createRoot } from 'react-dom/client'
import Button from './Buton'
import './index.less'

function App() {
  return (
    <div className='test'>
      this is vite page
      <div className='test-2'>this is test2</div>
      <Button></Button>
    </div>
  )
}
const container = document.getElementById('app')
const root = createRoot(container)
root.render(React.createElement(App))
