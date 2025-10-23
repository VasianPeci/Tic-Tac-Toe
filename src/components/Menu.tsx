import "./Menu.css";
import { useState } from "react";

type Props = {
    onAction(action: "reset" | "new-round", setMenuOpen: any): void;
};

export default function Menu({ onAction }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="menu">
            <button className="menu-btn" onClick={() => setMenuOpen(prev => !prev)}>
              Actions
              {menuOpen ? (<i className="fa-solid fa-chevron-up"></i>) : (<i className="fa-solid fa-chevron-down"></i>)}
              
            </button>

            {menuOpen && <div className="items border">
              <button onClick={() => onAction("reset", setMenuOpen)}>Reset</button>
              <button onClick={() => onAction("new-round", setMenuOpen)}>New Round</button>
            </div>}
          </div>
    );
};