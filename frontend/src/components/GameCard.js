import React, {useEffect, useState} from "react";
import {Button, CircularProgress, Collapse, Grid, LinearProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    progress: {
        height: '10px',
    }
}))


export default function GameCard(props) {
    const classes = useStyles()
    const [value, setValue] = useState(0)
    const [end, setEnd] = useState(false)
    const [visible, setVisible] = useState(true)

    const finish = props.room.finish_time

    function startRound() {
        let timerId = setInterval(() =>
            setValue((prevState => prevState + 100 / finish)), 1000);
        setTimeout(() => {
            clearInterval(timerId);
            if (props.lead) {
                handleFinish()
            }
        }, finish * 1000)
    }

    useEffect(() => {
        setVisible(true)
        setValue(0)
        if (props.room.timer) {
            startRound()
        }
    }, [props.room.timer])

    function new_word(method) {
        const requestOptions = {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: props.room.room
            })
        }
        fetch('/api/new-word', requestOptions)
            .then(response => response.json())
    }

    function handleFinish() {
        new_word('POST')
        setEnd(true)
    }

    return (
        <Collapse in={visible}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {(props.room.timer) ?
                        <LinearProgress variant='determinate' value={value} className={classes.progress}/>
                        :
                        null}
                </Grid>
                <Grid item container spacing={2}>
                    <Grid item xs={12} justify='center' style={{marginTop: '20px'}}>
                        {(props.room.timer) ?
                            <Grid item xs={12} justify='center' align='center'>
                                <Typography variant='h6' align='center'>
                                    Remaining Time: {(finish - value * finish / 100).toFixed()}
                                </Typography>
                            </Grid>
                            :
                            <Grid item xs={12} justify='center' align='center'>
                                {!(props.lead) ?
                                    <Typography variant='h6' align='center'>
                                        Waiting for
                                        <span style={{color: props.leader.user.color}}>
                                    {` ${(props.leader.user.name) ? props.leader.user.name: 'player'}`}
                                    </span>
                                    </Typography>
                                    :
                                    <Typography variant='h6' align='center'>
                                        {(end) ? 'Pass the move' : 'Start when you are ready'}
                                    </Typography>
                                }
                            </Grid>}
                        {(props.lead) ?
                            (!props.room.timer) ?
                                <Grid item xs={12} justify='center'
                                      alignItems='center' align='center'>
                                    {(end) ? <Button variant='contained' color='secondary'
                                                     onClick={() => {
                                                        setVisible(false)
                                                         setTimeout(() => {
                                                             setVisible(true)
                                                         }, 1000)
                                                         setEnd(false)
                                                         props.next_player()
                                                     }}>
                                            Finish
                                        </Button> :
                                        <Button variant='contained' color='secondary'
                                                onClick={() => new_word('PATCH')
                                                }>
                                            Start
                                        </Button>
                                    }
                                </Grid>
                                :
                                null
                            : (!props.room.timer) ?
                                <Grid item xs={12} justify='center'
                                      alignItems='center' align='center'>
                                    <CircularProgress color="secondary"/>
                                </Grid>
                                :
                                null
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Collapse>
    )
}

