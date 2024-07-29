import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ResponsiveLine } from '@nivo/line'
import KeenanData from './assets/Keenan-Nicholson.json'


function App() {
  console.log(KeenanData)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div style={{height: "1000px", width: "1000px"}}>
        <ResponsiveLine
          data={[KeenanData]}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear' }}
        />
      </div>
      
    </>
  )
}

export default App
