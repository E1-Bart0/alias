import React, {useEffect, useState} from "react";
import {Button, Grid, IconButton, Paper, Slide, Typography} from "@material-ui/core";
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import {makeStyles} from "@material-ui/core/styles";
import JoinPage from "./JoinPage";
import {ArrowDropUp} from "@material-ui/icons";
import Header from "./Header";
import RoomPage from "./RoomPage";

const useStyles = makeStyles((theme) => ({
    root: {display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto',},
    container: {alignItems: 'center'},
    paper: {margin: theme.spacing(1), display: 'flex',},

}))


export default function HomePage(props) {
    const classes = useStyles();
    const [join, setJoin] = useState(false)
    const [room, setRoom] = useState(null)
    const [error, setError] = useState(null)

    useEffect(async () => {
        fetch('/api/room')
            .then((response) => response.json())
            .then((data) => {
                setRoom(data.room)
            })
    }, [])


    function joinView() {
        return (<Button variant='contained' color='primary'
                        onClick={() => setJoin(!join)}> Join Room </Button>)
    }

    function renderHomePage() {
        return (
            <div className={classes.root}>
                <Header/>
                <div className={classes.container}>
                    <Typography align='center'><h1>Welcome to my game!</h1></Typography>
                    <Grid container spacing={0} direction='row' alignItems='center' justify='center'>
                        {(!join) ? joinView() : null}
                        <Button variant='contained' color='secondary'
                                component={Link} to={'/create'}>Create Room</Button>
                    </Grid>
                    <div className={classes.paper}>
                        <Slide direction="up" in={join}>
                            <Paper elevation={2} className={classes.paper}>
                                <Grid container direction='column' justify='center' alignItems='center'>
                                    <JoinPage/>
                                    <IconButton onClick={() => setJoin(!join)} size='medium' color='default'>
                                        <ArrowDropUp/>
                                    </IconButton>
                                </Grid>
                            </Paper>
                        </Slide>
                    </div>
                </div>
            </div>)
    }


    return (
        <Router>
            <Switch>
                <Route exact path='/'
                       render={() => {
                           return room ? (
                               <Redirect to={`/room/${room}`}/>
                           ) : (
                               renderHomePage()
                           );
                       }}
                />
                <Route path='/create' component={CreateRoomPage}/>
                <Route
                    path="/room/:room"
                    render={(props) => {
                        return <RoomPage {...props} leaveRoom={() => setRoom(null)}/>;
                    }}
                />
            </Switch>
        </Router>
    )
}