import { CardType } from "../gameBoard/gameBoard.types";
import { GameModeTypes } from "../gameConfig/gameConfig.types";

// ********************************************************
// HELPER FUNCTIONS

/**
 * Gets the current Y translation from the deck pile to the flipped pile
 * @param deckPile deck pile cards
 * @param flippedPile flipped pile cards
 */
export const getTranslationY = (
  deckPile: Array<CardType>,
  flippedPile: Array<CardType>
) => {
  // get the number of cards of each pile
  const nDeckCards = deckPile.length;
  const nFlippedCards = flippedPile.length;

  // get the difference
  const diffCards = nDeckCards - nFlippedCards;

  return diffCards;
};

// ********************************************************
// FLIPPING FUNCTIONS

/**
 * Flips one deck card to the flipped pile
 * @param deckPile
 * @param flippedPile
 */
export const flipDeckCard = (
  deckPile: Array<CardType>,
  flippedPile: Array<CardType>,
  gameMode: GameModeTypes
) => {
  // create copy of the deck pile
  const tempDeckPile = [...deckPile];
  // get the top 3 cards of the deck pile
  const cardsToFlip = gameMode === "turnThree" ? -3 : -1;
  const cardsFlipped = tempDeckPile.splice(cardsToFlip);
  // get copy of the flipped pile
  const tempFlippedPile = [...flippedPile];

  // add the flipped cards to the flipped pile
  const flippedCards = cardsFlipped.map((card) => ({ ...card, flipped: true } as CardType));
  tempFlippedPile.push(...flippedCards);

  // get the new value for the translation y
  const translationY = getTranslationY(tempDeckPile, tempFlippedPile);

  return {
    deckPile: tempDeckPile,
    flippedPile: tempFlippedPile,
    translationY,
    startRedoAnimation: false
  };
};

/**
 * Flips one deck card to the flipped pile
 * @param deckPile
 * @param flippedPile
 */
export const unflipDeckCard = (
  deckPile: Array<CardType>,
  flippedPile: Array<CardType>,
  nCards: Array<CardType>
) => {
  // create copy of the flipped pile
  const tempFlippedPile = [...flippedPile];
  // get the top card of the flipped pile
  const cardsFlipped = tempFlippedPile.splice(-nCards.length);
  // get copy of the deck pile
  const tempDeckPile = [...deckPile];

  // if there was indeed a card to be flipped, then add it to the deck pile
  if (cardsFlipped) {
    const flippedCards = cardsFlipped.map((card) => ({ ...card, flipped: true } as CardType));
    tempDeckPile.push(...flippedCards);
  }

  // get the new value for the translation y
  const translationY = getTranslationY(tempDeckPile, tempFlippedPile);

  return {
    deckPile: tempDeckPile,
    flippedPile: tempFlippedPile,
    translationY,
    startUndoAnimation: false
  };
};

/**
 * Resets a deck from the source to the target
 * @param sourceId id of the pile source (to be turned)
 * @param targetId id of the pile target (to receive cards)
 * @param source cards of the pile to turn
 */
export const resetDeck = (
  sourceId: string,
  targetId: string,
  source: Array<CardType>,
  gameMode: GameModeTypes,
  reversed?: boolean
) => {
  let final = source.map((card: CardType) => ({
    ...card,
    flipped: targetId === "flippedPile"
  }));
  if (gameMode === "turnThree") {
    //reverse every 3 items for turn three mode
    final = reverseChunks(final, 3);
  }
  return {
    translationY: source.length,
    [targetId]: reversed ? final : final.reverse(),
    [sourceId]: []
  };
};

const reverseChunks = <T>(array: T[], chunkSize: number): T[] => {
  const result: T[] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(...chunk.reverse());
  }
  return result;
};


// ********************************************************
// DRAGGING FUNCTIONS

/**
 * Sets the cards that are currently being dragged (the top card of the flipped pile)
 * @param flippedPile
 */
export const setCardDragging = (flippedPile: Array<CardType>) => {
  // create copy of the flipped pile
  const tempFlippedPile = [...flippedPile];
  // get the top card
  const cardFlipped = tempFlippedPile.pop();

  // only return the cards that are being dragged
  return {
    cardDragging: [cardFlipped]
  };
};

// ********************************************************
// ADD CARDS FUNCTIONS

/**
 * Adds back to the flipped pile, a card from a undo/redo movement
 * @param flippedPile
 * @param card card to be added
 */
export const addCardToFlipped = (
  flippedPile: Array<CardType>,
  card: CardType
) => {
  return {
    flippedPile: [...flippedPile, { ...card, cardFlipped: "deckPile" }]
  };
};
