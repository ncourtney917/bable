import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/playgame';
import {useParams} from 'react-router-dom';
import { CompactTable } from '@table-library/react-table-library/compact';


export const Leaderboard = () => {
    const { gameId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const columns = [
        { label: 'Name', renderCell: (item) => item.PlayerName },
        { label: 'Guesses', renderCell: (item) => item.Guesses }
    ]

    const getLeaderboard = async(id) => {
        const endpoint = `/data-api/rest/GameLeaderboard`;
        const response = await fetch(`${endpoint}`);
        const result = await response.json();
        const filteredData = result.value.filter(score => score.GameId === id);
        return filteredData.sort((a, b) => a.Guesses - b.Guesses);
    }

    useEffect(() => {
        const fetchData = async () => {
          const sortedData = await getLeaderboard(gameId);
          setLeaderboard(sortedData);
        };
    
        fetchData();
      }, [gameId]);

    // Create leaderboard
    return (
        <CompactTable title="Leaderboard" data={{ nodes: data }} columns={columns} />
    )
}







