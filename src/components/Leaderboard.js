import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/playgame';
import {useParams} from 'react-router-dom';
import { CompactTable } from '@table-library/react-table-library/compact';


function Leaderboard () {
    const { leaderboard } = useContext(AppContext);
    const columns = [
        { label: 'Name', renderCell: (item) => item.PlayerName },
        { label: 'Guesses', renderCell: (item) => item.Guesses }
    ]

    // Create leaderboard
    return (
        <div className="table-container">
            <h2>Leaderboard</h2>
            <div className="table-scroll">
                <CompactTable data={{ nodes: leaderboard }} columns={columns} />
            </div>
        </div>    
    )
}


export default Leaderboard;