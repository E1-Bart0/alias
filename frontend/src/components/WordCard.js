import React, {useEffect, useState} from "react";
import {Button, Card, CardActionArea, CardContent, Grid, Slide} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";


export default function WordCard(props) {
    const [focus, setFocus] = useState(false)
    const [visible, setVisible] = useState(true)
    const [width, setWidth] = useState(100)
    const [guess, setGuess] = useState(false)

    useEffect(() => {
        setGuess(props.word.guess === 1)
    }, [props.word.guess])


    const useStyles = makeStyles((theme) => ({
        root: {
            height: (focus) ? 250 : 140,
            width: (focus) ? 210 : width,
            backgroundImage: (focus && (props.lead || guess)) ?
                `url(${props.word.img})`
                : null,
            backgroundSize: 'cover',
            background: (props.lead || props.room.room_lead.length === 0 || guess) ?
                (!focus) ? 'whitesmoke' : null :
                `linear-gradient(0deg, #ffffff 0%, ${props.room.room_lead[0].player.user.color} 100%)`,
        },
        action: {
            width: '100%',
            height: '100%',
        },
        unFocusText: {
            position: 'absolute',
            bottom: (props.word.word.length > 9) ? '25%' : '50%',
            right: (props.word.word.length > 9) ? '5%' : '50%',
            transform: (props.word.word.length > 9) ?
                'rotate(-60deg)' : 'translate(50%, -50%)',
        },
        glass: {
            position: 'relative',
            flexGrow: '1',
            background: 'linear-gradient(to left, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
            borderRadius: '20px',
        }
    }))

    function handleGuess() {
        if (props.lead) {
            props.handleGuess(props.word)
        }
        setVisible(false)
    }

    const classes = useStyles()
    return (
        <Slide in={visible}
               direction={'up'}
               onExited={() => setWidth(0)}
               style={{transformOrigin: '0 0 0'}}
               {...(visible ? {timeout: props.index * 500} : {})}
        >
            <Card className={classes.root} elevation={5}>
                <CardActionArea
                    className={classes.action}
                    onPointerEnter={() => {
                        setFocus(true)
                    }}
                    onPointerLeave={() => {
                        setFocus(false)
                    }}
                >
                    <CardContent>
                        {(props.lead || guess) ?
                            (!focus) ?
                                <Grid item xs={12} alignItems='center' justify='center' className={classes.unFocusText}>
                                    <Typography variant='h6'
                                                align='center'>
                                        {props.word.word}
                                    </Typography>
                                </Grid>
                                :
                                <Grid container spacing={2}
                                      className={classes.glass}
                                >
                                    <Grid item xs={12} alignItems='flex-start' justify='flex-start'>
                                        <Typography variant='h6' align='center'>
                                            {props.word.word}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} justify='center' align='center'>
                                        <Button variant='contained' color='secondary'
                                                onClick={() => handleGuess()}>
                                            {(props.lead) ? 'Guess' : 'Take Away'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            : null}
                    </CardContent>
                </CardActionArea>
            </Card>
        </Slide>
    )
}
