import React, { useState, useEffect, useRef } from 'react'

import Footer from './Footer'
import Header from './Header'

const Game = ({ game, actions }) => {
  const { shoe, idx, rand, count, is_visible } = game
  const idxEnd = idx + rand
  const cards = shoe.slice(idx, idxEnd)
  const isOver = idxEnd >= shoe.length

  // state for interval handling
  const [intervalMs, setIntervalMs] = useState(1000) // default 1s
  const [isAuto, setIsAuto] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isAuto && !isOver) {
      intervalRef.current = setInterval(() => {
        actions.deal()
      }, intervalMs)
    }
    return () => clearInterval(intervalRef.current)
  }, [isAuto, intervalMs, isOver, actions])

  const startAuto = () => {
    if (!isAuto) setIsAuto(true)
  }

  const stopAuto = () => {
    setIsAuto(false)
    clearInterval(intervalRef.current)
  }

  return (
    <div className='p3 mx-auto' style={{ maxWidth: 600 }}>
      <Header />
      <div className='mb3'>
        {cards.map((c, i) =>
          <img
            key={i}
            alt={c}
            className='mr1'
            src={`${process.env.PUBLIC_URL}/img/cards/${c}.svg`}
            style={{ width: 100, height: 139 }}
          />
        )}
      </div>
      <div className='mb2'>
        <button
          className='btn btn-primary bg-red'
          onClick={actions.toggleCount}
          style={{ width: 210 }}
        >
          {is_visible ? 'Hide' : 'Show'} running count
        </button>
        {is_visible &&
          <span className='ml2 h3 bold align-middle'>{count}</span>
        }
      </div>
      <div className='mb2'>
        <button
          className='btn btn-primary bg-black mr2'
          onClick={actions.newGame}
        >
          Reset
        </button>
        <button
          className='btn btn-primary bg-black mr2'
          disabled={isOver}
          onClick={actions.deal}
        >
          More cards →
        </button>
      </div>
      <div className='mb2'>
        <input
          type='number'
          value={intervalMs}
          min={200}
          step={100}
          onChange={e => setIntervalMs(Number(e.target.value))}
          className='mr2 p1 border rounded'
          style={{ width: 100 }}
        />
        <button
          className='btn btn-primary bg-green mr2'
          disabled={isAuto || isOver}
          onClick={startAuto}
        >
          Auto Deal ▶
        </button>
        <button
          className='btn btn-primary bg-gray'
          disabled={!isAuto}
          onClick={stopAuto}
        >
          Stop ⏹
        </button>
      </div>
      <p className='h5'>
        {isOver
          ? `Nice! You just went through ${shoe.length} cards 🎉`
          : `Cards seen: ${idxEnd} (${shoe.length - idxEnd} remaining)`
        }
      </p>
      <Footer />
    </div>
  )
}

export default Game
