import React, { useEffect } from 'react'
import { createChart } from 'lightweight-charts'
import { io } from 'socket.io-client'
import { getCryptoData } from './api'
import moment from 'moment'
import './App.css'

const ENDPOINT = 'http://127.0.0.1:4000'
const socket = io(ENDPOINT, {
  transports: ['websocket', 'polling']
})

var chart = createChart(document.body, {
  height: 450,
  layout: {
    textColor: '#d1d4dc',
    backgroundColor: '#000000',
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
  },
  crosshair: {
    vertLine: {
      color: '#6A5ACD',
      width: 0.5,
      style: 1,
      visible: true,
      labelVisible: true,
    },
    horzLine: {
      visible: true,
      labelVisible: true,
    },
  },
  priceScale: {
    position: 'left',
    mode: 2,
    autoScale: false,
    invertScale: true,
    alignLabels: false,
    borderVisible: false,
    borderColor: '#555ffd',
    scaleMargins: {
      top: 0.30,
      bottom: 0.25,
    },
  },
  grid: {
    vertLines: {
      color: 'rgba(42, 46, 57, 0)',
    },
    horzLines: {
      color: 'rgba(42, 46, 57, 0)',
    },
  },
})

chart.timeScale().fitContent();

const lineSeries = chart.addAreaSeries()

export default function App ({ }) {
  useEffect(async () => {
    const pastData = await getCryptoData()
    const formattedData = pastData.map(d => {
      const currentDate = new Date()
      const mil = currentDate.getTimezoneOffset()
      const time = new Date(d.t).getTime() / (1000) - mil * 60
      return {
        ...d,
        time,
        value: d.p,
        format: moment.unix(d.t/1000).format("MM/DD/YYYY HH:mm:ss")
      }
    })
    formattedData.map(f => lineSeries.update(f))

    socket.on('trade_data', t => {
      try {
        const currentDate = new Date()
        const mil = currentDate.getTimezoneOffset()
        const time = new Date(t.t).getTime() / (1000) - mil * 60
        lineSeries.update({ time, value: t.p })
      } catch (e) {}
    })
  }, [])

  return <div>
    <h1>Crypto Trade Statistics</h1>
    <div id='chart-container'></div>
  </div>
}
