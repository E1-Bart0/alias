import React, {useState} from "react";
import {Button, Grid, Paper, TextField, withStyles} from "@material-ui/core";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {display: 'flex', flexWrap: 'wrap',},
    iconButton: {color: '#000'},
    paper: {margin: 20}
}));

const theme = createMuiTheme({
    palette: {primary: green,},
});

const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

export default function JoinPage(props) {
    const classes = useStyles()
    const [code, setCode] = useState(null)
    const [error, setError] = useState(true)


    function validRoom(e) {
        const room = e.target.value.toUpperCase();
        if (room.length === 6) {
            setCode(room)
            checkRoom(room)
        } else {
            setError(true)
        }
    }

    function checkRoom(room) {
        fetch('/api/rooms')
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    (data.forEach(element => {
                        if (element.room === room) {
                            setError(false)
                        }
                    }))
                }
            })
    }

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <Grid container justify='center' direction='row'>
                    <form className={classes.root} noValidate autoComplete="off">
                        <ThemeProvider theme={theme}>
                            <ValidationTextField
                                className={classes.margin}
                                label="Room Code"
                                error={error}
                                variant="outlined"
                                id="validation-outlined-input"
                                inputProps={{style: {textTransform: 'uppercase'}}}
                                onChange={e => validRoom(e)}
                            />
                        </ThemeProvider>
                    </form>
                    {(error) ?
                        <Button variant='contained' color='default'>Join</Button> :
                        <Button variant='contained' color='primary' to={`/room/${code}`}
                                component={Link}>Join</Button>}
                </Grid>
            </Paper>
        </div>
    )
}