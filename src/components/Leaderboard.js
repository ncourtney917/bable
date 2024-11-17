import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/playgame';
import {useParams} from 'react-router-dom';
import Popup from 'reactjs-popup';
import { CompactTable } from '@table-library/react-table-library/compact';


function Leaderboard () {
    const { leaderboard } = useContext(AppContext);
    const columns = [
        { label: 'Name', renderCell: (item) => item.PlayerName },
        { label: 'Guesses', renderCell: (item) => item.Guesses }
    ]

    // Create leaderboard
    return (
        <Popup 
            trigger={<button className="leaderboard-button submit">View leaderboard</button>}
            defaultOpen={false}
            position="top center"
            arrow={false}
            modal={true}
            closeOnDocumentClick={false}
            closeOnEscape={false}
            overlayStyle={{
                background: 'rgba(0, 0, 0, 0.7)', // Optional, to make the overlay darkened
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              contentStyle={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                padding: '0', // Remove any default padding
                margin: '0', // Remove any default margin
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                zIndex: 1000,
              }}
        >
            {(close) => (
                <div className="gameOver popup-leaderboard">
                    <button onClick={close} className="close-button" >
                        &times;
                    </button>
                    <div className="table-container">
                        <h2>Leaderboard</h2>
                        <div className="table-scroll">
                            <CompactTable data={{ nodes: leaderboard }} columns={columns} />
                        </div>
                    </div>    
                </div>
            )}
        </Popup>
    )
}


export default Leaderboard;