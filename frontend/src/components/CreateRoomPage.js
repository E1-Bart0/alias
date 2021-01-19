import React, {useEffect, useState} from "react";
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
    const [diff, setDiff] = useState('easy')
    const [words, setWords] = useState(2)
    const [successMsg, setSuccess] = useState(null)
    const [errorsMsg, setErrors] = useState(null)


    function changeDiff(difficulty) {
        setDiff(difficulty)
    }

    const images = {
        'easy': (<ImageCard
            image='https://sun9-38.userapi.com/impg/Tj2MEF8-iWshmyBx41pp0zuZ8w0HiQcGfZSLzA/dBjR4pFrrXI.jpg?size=256x389&quality=96&proxy=1&sign=f01dc66c618d64b584332a78f04bc19f&type=album'
            difficulty='easy'
            current_diff={diff}
            ClickEvent={changeDiff}
        />),
        'medium': (<ImageCard
            image='https://vk.com/sticker/1-12702-128'
            difficulty='medium'
            current_diff={diff}
            ClickEvent={changeDiff}
        />),
        'hard': (<ImageCard
            image='https://vk.com/sticker/1-12691-128'
            difficulty='hard'
            current_diff={diff}
            ClickEvent={changeDiff}
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
            }).then((data) => props.history.push('/room/'+data.room))
    }

    if (errorsMsg) {
        return ('Error To Create Room')
    }
    return (
        <div className={classes.root}>
            <Header/>
            <div className={classes.container}>
                <Typography variant='h4' align='center'>Create Room</Typography>
                {draw_images()}
                <Grid align='center'>
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    defaultValue={words}
                    inputProps={{ min: 2, style: {textAlign: "center"},}}
                    helperText='Amounts of words to finish'
                    margin='normal'
                    onChange={event => setWords(event.target.value)}
                />
                </Grid>
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
            </div>
        </div>)
}