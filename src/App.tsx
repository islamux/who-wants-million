import { useGame } from './hooks/useGame'
import { useSound } from './hooks/useSound'
import { StartScreen } from './components/StartScreen'
import { GameBoard } from './components/GameBoard'
import { GameOver } from './components/GameOver'
import { MoneyTree } from './components/MoneyTree'
import { ErrorBoundary } from './components/ErrorBoundary'
import { moneyLevels } from './data/questions'
import './App.css'

export default function App() {
  const {
    state,
    currentQuestion,
    safeHavenPrize,
    startGame,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    useFiftyFifty,
    useAudience,
    walkAway,
    handleTimeout,
    tick,
    restart,
  } = useGame()

  const { initialize, play } = useSound()

  const handleRestart = () => {
    restart()
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        {state.phase === 'idle' && (
          <StartScreen onStart={startGame} />
        )}

        {state.phase === 'playing' && (
          <ErrorBoundary>
            <GameBoard
              state={state}
              currentQuestion={currentQuestion}
              soundPlay={play}
              soundInit={initialize}
              onSelect={selectAnswer}
              onConfirm={confirmAnswer}
              onNext={nextQuestion}
              on5050={useFiftyFifty}
              onAudience={useAudience}
              onWalkAway={walkAway}
              onTimeout={handleTimeout}
              onTick={tick}
            />
          </ErrorBoundary>
        )}

        {state.phase === 'gameover' && (
          <ErrorBoundary>
            <GameOver
              gameWon={state.gameWon}
              walkedAway={state.walkedAway}
              message={state.gameMessage?.text ?? ''}
              winnings={
                state.gameWon
                  ? 'أنت الآن مليونير!'
                  : state.walkedAway
                    ? `لقد فزت بمبلغ ${moneyLevels[state.currentQuestionIndex]?.amount ?? '0 ريال'}.`
                    : `لقد عدت إلى المنزل بمبلغ ${safeHavenPrize}.`
              }
              onRestart={handleRestart}
            />
          </ErrorBoundary>
        )}
      </div>

      <MoneyTree
        currentQuestionIndex={state.currentQuestionIndex}
        gameStarted={state.phase === 'playing'}
        gameOver={state.phase === 'gameover'}
      />
    </div>
  )
}
