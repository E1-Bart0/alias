import React, {useState} from "react";
import Header from "./Header";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, GridList, Grow, TextField, Typography} from "@material-ui/core";
import ImageCard from "./ImageCard";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto'},
    container: {alignItems: 'center', justifyContent: 'center', direction: 'row',},
    paper: {margin: theme.spacing(1), display: 'flex',},
    cards: {direction: 'row', alignItems: 'center', margin: '40px'},
    buttons: {margin: 10,},
}))


export default function CreatePage(props) {
    const classes = useStyles();
    const [diff, setDiff] = useState(props.diff || 'easy')
    const [words, setWords] = useState(props.words_amount || 20)
    const [time, setTime] = useState(props.time || 30)
    const [successMsg, setSuccess] = useState(null)
    const [errorsMsg, setErrors] = useState(null)

    function handleTime(value) {
        setTime(value)
        if (props.dialog) {
            props.setTime(value)
        }
    }

    function handleWords(value) {
        setWords(value)
        if (props.dialog) {
            props.setWords(value)
        }

    }

    function changeDiff(difficulty) {
        setDiff(difficulty)
        if (props.dialog) {
            props.setDiff(difficulty)
        }
    }

    const images = {
        'easy': (<ImageCard
            image='https://vk.com/sticker/1-12702-128'
            difficulty='easy'
            dialog={props.dialog}
            current_diff={diff}
            ClickEvent={(e) => changeDiff(e)}
        />),
        'medium': (<ImageCard
            image='https://vk.com/sticker/1-12691-128'
            difficulty='medium'
            dialog={props.dialog}
            current_diff={diff}
            ClickEvent={(e) => changeDiff(e)}
        />),
        'hard': (<ImageCard
            image='https://hookahrussia.ru/wp-content/uploads/2015/12/hd-wallpapers-hookah-smoke-rings-wallpaper-i-1920x1080-wallpaper-720x415.jpg'
            dialog={props.dialog}
            difficulty='hard'
            current_diff={diff}
            ClickEvent={(e) => changeDiff(e)}
        />)
    }

    function* order_images() {
        let key
        for (key in images) {
            if (key !== diff) {
                yield images[key]
            }
        }
    }

    function draw_images() {
        const iterator = order_images()
        return (<Grow in={diff}>
            <GridList className={classes.cards}>
                {iterator.next().value}{images[diff]}{iterator.next().value}
            </GridList></Grow>)
    }

    function handleClick() {
        const request_option = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                difficulty: diff,
                words_amount: words,
                finish_time: time,
            })
        }
        fetch('/api/create-room', request_option)
            .then((response) => {
                if (response.ok) {
                    setSuccess('Room Created');
                    return response.json()
                } else {
                    setErrors('Error Create');
                    console.log('Error Create');
                }
            }).then((data) => props.history.push('/room/' + data.room))
    }

    if (errorsMsg) {
        return ('Error To Create Room')
    }
    return (
        <div className={classes.root} style={{maxHeight: (props.dialog) ? '500px' : null}}>
            <Header/>
            <div className={classes.container}>
                <Typography variant='h4' align='center'>
                    {(props.dialog) ? 'Settings' : 'Create Room'}
                </Typography>
                {draw_images()}
                <Grid container alignItems='center' direction='row' justify='center'>
                    <Grid item align='center'>
                        <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            defaultValue={words}
                            inputProps={{min: 2, style: {textAlign: "center"},}}
                            helperText='Amounts of words to finish'
                            margin='normal'
                            onChange={event => handleWords(event.target.value)}
                        />
                    </Grid>
                    <Grid item align='center'>
                        <TextField
                            id="standard-number"
                            label="Time"
                            type="number"
                            defaultValue={time}
                            inputProps={{min: 10, style: {textAlign: "center"},}}
                            helperText='Round time (seconds)'
                            margin='normal'
                            onChange={event => handleTime(event.target.value)}
                        />
                    </Grid>
                </Grid>
                {(!props.dialog) ?
                    <Grid direction='column' align='center'>
                        <Button className={classes.buttons} variant='contained' color='primary'
                                onClick={() => handleClick()}>
                            Create Room
                        </Button>
                        <Button className={classes.buttons} variant='contained' color='secondary'
                                component={Link} to={'/'}>
                            Back to main
                        </Button>
                    </Grid>
                    : null}
            </div>
        </div>)
}