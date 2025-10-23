import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameState, Player } from "./types";
import classNames from "classnames";
import { deriveGame, deriveStats } from "./utils";

export default function App() {
  const [state, setState] = useState<GameState>({
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
  });

  function handlePlayerMove(squareId: number, player: Player) {
    setState(prev => {
        const stateClone = structuredClone(prev);

        stateClone.currentGameMoves.push({
        squareId,
        player,
        });

        return stateClone;
    });
  }

  function resetGame(isNewRound: boolean, setMenuOpen?: any) {
    setState(prev => {  
        const stateClone = structuredClone(prev);

        const { status, moves} = game;

        if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
            moves,
            status,
        });
        }

        stateClone.currentGameMoves = [];

        if (isNewRound) {
            stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
            stateClone.history.currentRoundGames = [];
        }

        if (setMenuOpen)  setMenuOpen(false);

        return stateClone;
    });
  }

  const game = deriveGame(state);
  const stats = deriveStats(state);

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i className={classNames("fa-solid", game.currentPlayer.iconClass)}></i>
            <p>{game.currentPlayer.name}, you're up!</p>
          </div>

          <Menu onAction={(action: any, setMenuOpen: any) => resetGame(action === 'new-round', setMenuOpen)}></Menu>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(squareId => {
            const existingMove = game.moves.find(move => move.squareId === squareId);

            return (
                <div key={squareId} className="square shadow" onClick={() => {
                    if (existingMove) return;

                    handlePlayerMove(squareId, game.currentPlayer);
                }}>
                    {existingMove && <i className={classNames("fa-solid", existingMove.player.colorClass, existingMove.player.iconClass)}></i>}
                </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span>{stats.playerWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span>{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>
      <Footer></Footer>
      {game.status.isComplete && <Modal message={game.status.winner ? `${game.status.winner.name} wins!`: "Tie!"} onClick={() => resetGame(false)}></Modal>}
    </>
  );
}
