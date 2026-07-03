// Card suits and ranks for a standard deck of cards
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

// Interface for a card, including its suit and rank.
interface Card {
  suit: Suit
  rank: Rank
}

// Interface for the game state, including the deck, player hand, dealer hand, and result.
interface GameState {
  deck: Card[]
  playerHand: Card[]
  dealerHand: Card[]
  result: string | null
}

// Constants for suits and ranks
const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Rank values for Blackjack, with Aces initially counted as 11
const RANK_VALUES: Record<Rank, number> = {
  A: 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
}

/**
 * Shuffle an array of cards in place using the Fisher-Yates algorithm.
 * @param cards - The array of cards to shuffle.
 */
function shuffle(cards: Card[]): void {
  // Shuffle the cards in place
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }
}

/**
 * Build a shuffled deck of 52 cards.
 * @returns An array of Card objects representing a shuffled deck.
 */
function buildShuffledDeck(): Card[] {
  const deck: Card[] = []

  // Create a standard 52-card deck
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }

  // Shuffle the deck before returning it
  shuffle(deck)
  return deck
}

/**
 * Calculate the total value of a hand of cards, taking into account the special rules for Aces.
 * @param hand - The array of cards in the hand.
 * @returns The total value of the hand.
 */
function handValue(hand: Card[]): number {
  let points = 0
  let aces = 0

  // Calculate the initial points and count the number of Aces
  for (const card of hand) {
    points += RANK_VALUES[card.rank]

    if (card.rank === 'A') {
      aces++
    }
  }

  // Adjust for Aces if the total points exceed 21
  while (points > 21 && aces > 0) {
    points -= 10
    aces--
  }

  return points
}

/**
 * Start a new game of Blackjack by creating a shuffled deck and dealing two cards to both the player and the dealer.
 * @returns A GameState object representing the initial state of the game.
 */
export function newGame(): GameState {
  const deck = buildShuffledDeck()
  const playerHand = [deck.pop()!, deck.pop()!]
  const dealerHand = [deck.pop()!, deck.pop()!]

  return {
    deck,
    playerHand,
    dealerHand,
    result: null,
  }
}

/**
 * Handle the "Hit" action in the game.
 * @param state - The current game state.
 * @returns A new game state with the player's hand updated.
 */
export function hit(state: GameState): GameState {
  const deck = [...state.deck]
  const playerHand = [...state.playerHand, deck.pop()!]
  const result = handValue(playerHand) > 21 ? 'You busted! Dealer wins!' : state.result

  return {
    ...state,
    deck,
    playerHand,
    result,
  }
}

/**
 * Handle the "Stand" action in the game. if the player stands, the dealer will draw cards until they reach a value of 17 or higher. 
 * The result of the game is then determined based on the final hand values.
 * @param state - The current game state.
 * @returns A new game state with the dealer's hand updated.
 */
export function stand(state: GameState): GameState {
  const deck = [...state.deck]
  const dealerHand = [...state.dealerHand]
  const playerValue = handValue(state.playerHand)
  let dealerValue = handValue(dealerHand)

  // Dealer hits until they reach 17 or higher
  while (dealerValue < 17) {
    dealerHand.push(deck.pop()!)
    dealerValue = handValue(dealerHand)
  }

  // Determine the result of the game
  let result: string
  if (dealerValue > 21 || playerValue > dealerValue) {
    result = 'You win!'
  } else if (playerValue < dealerValue) {
    result = 'Dealer wins!'
  } else {
    result = "It's a tie!"
  }

  return {
    ...state,
    deck,
    dealerHand,
    result,
  }
}
