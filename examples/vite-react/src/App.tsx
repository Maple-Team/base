import './App.css'
import Hello from './Hello'
import { Button, Scrollbar } from '@liutsing/rc-components'
import '@liutsing/rc-components/dist/esm/index.css'

function App() {
  return (
    <Scrollbar className="App">
      <div>Vite</div>
      <Hello name="World" />
      <Button>1</Button>
    </Scrollbar>
  )
}

export default App
