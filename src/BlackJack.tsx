import { useState } from 'react'
import { newGame, hit, stand } from './blackjack/BlackJackGameLogic'

function BlackJack() {
  // Initialize the game state using the newGame function and set up state variables for the player's hand,
  // dealer's hand, and game result.
  const [gameState, setGameState] = useState(() => newGame())
  // Destructure the game state to access the player's hand, dealer's hand, and result for rendering.
  const { playerHand, dealerHand, result } = gameState

  /**
   * Render the Blackjack game interface, including the player's hand, dealer's hand, and action buttons for
   * "New Game", "Hit", and "Stand".
   * The game state is updated based on the player's actions, and the result of the game is displayed when applicable.
   */
  return (
    <div style={{ textAlign: "left", marginLeft: "20px" }}>
        <h1>Blackjack</h1>
        <div>
          <h2>Player's Hand</h2>
          <ul>
            {playerHand.map((card, index) => (
              <li key={index}>{card.rank} of {card.suit}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Dealer's Hand</h2>
          <ul>
            {dealerHand.map((card, index) => (
              <li key={index}>{card.rank} of {card.suit}</li>
            ))}
          </ul>
        </div>
        <div>
            <button style={{ margin: '5px' }} onClick={() => {
                const newGameState = newGame()
                setGameState(newGameState)
            }}>New Game</button>
            {!result && (
                <>
                    <button style={{ margin: '5px' }} onClick={() => {
                        const newGameState = hit(gameState)
                        setGameState(newGameState)
                    }}>Hit</button>
                    <button style={{ margin: '5px' }} onClick={() => {
                        const newGameState = stand(gameState)
                        setGameState(newGameState)
                    }}>Stand</button>
                </>
            )}
        </div>
        <div>
            {result && <h2>{result}</h2>}
        </div>

    </div>
  )
}

export default BlackJack
