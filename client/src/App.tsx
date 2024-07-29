import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ResponsiveLineCanvas } from '@nivo/line'
import KeenanData from './assets/Keenan-Nicholson.json'


function App() {
  console.log(KeenanData)
  return (
    <>
      <div style={{height: "1000px", width: "1000px"}}>
        <ResponsiveLineCanvas
          data={[KeenanData]}
          yScale={{ type: 'linear' }}
          // enableGridX={false}
          margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
          gridXValues={["2021-01-01T00:00:00.000Z","2022-01-01T00:00:00.000Z","2023-01-01T00:00:00.000Z","2024-01-01T00:00:00.000Z"]}
          axisBottom={{
            tickValues: [
                0,
                20,
                40,
                60,
                80,
                100,
                120
            ],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2f',
            legend: 'price',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        />
      </div>
      
    </>
  )
}

export default App
