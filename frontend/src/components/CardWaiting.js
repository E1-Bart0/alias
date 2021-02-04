import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, CircularProgress, Grid, LinearProgress} from "@material-ui/core";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {},
}))


export default function CardWaiting(props) {
    const [value, setValue] = useState(0)
    const classes = useStyles()

    useEffect(() => {
        const ready_players = (props.all_players).filter((player) => {
            if (player.ready) {
                return player
            }
        })
        setValue(ready_players.length / Math.max(props.all_players.length, 2) * 100)
    }, [props.all_players])

    function can_start(all_players) {
        let len_team1 = 0;
        let len_team2 = 0;
        if (all_players) {
            all_players.forEach(player => {
                if (!player.ready) {
                    setGameStartFalse()
                    return false;
                }
                if (player.team === 1) {
                    len_team1 += 1;
                } else if (player.team === 2) {
                    len_team2 += 1;
                }
            })
            if (len_team1 > 0 && len_team2 > 0) {
                return true;
            }
        } else {
            setGameStartFalse()
            return false;
        }
    }

    function setGameStartFalse() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: props.room.room
            })
        }
        fetch('/api/game-start', requestOptions)
            .then(response => {
                if (response.ok) {
                    console.log(response.error())
                }
            })
    }

    return (
        <Grid container spacing={2} justify='center'>
            <Grid item xs={12} alignItems='flex-start'>
                {(value !== 100) ? <LinearProgress variant='determinate' value={value}/> : null}
            </Grid>
            <Grid item xs={12} alignItems='center'>
                <Typography variant='h4' align='center'>
                    Game
                </Typography>
            </Grid>
            <Grid item container spacing={2}>
                <Grid item xs={12} justify='center'>
                    <Typography variant='h6' align='center'>
                        {(value === 100) ?
                            'Waiting for host' : 'Waiting for others'
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12} justify='center'
                      alignItems='center' align='center'>
                    {(value === 100) ?
                        (props.me && props.me.is_host && can_start(props.all_players)) ?
                            <Button variant='contained' color='secondary'
                                    onClick={() => props.handleStart()}>
                                Start
                            </Button> :
                            <CircularProgress color="secondary"/> :
                        <CircularProgressWithLabel
                            value={value}/>}
                </Grid>
            </Grid>
        </Grid>
    )
}

