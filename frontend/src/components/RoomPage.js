import React, {useEffect, useState} from "react";
import {Button, Grid, Slide, Typography} from "@material-ui/core";
import Header from "./Header";
import {makeStyles} from "@material-ui/core/styles";
import {Build, ExitToApp} from "@material-ui/icons";
import AvatarPlayers from "./Avatar";
import CardTeam from "./CardTeam";
import Game from "./Game";
import WordCard from "./WordCard";
import WinnerDialog from "./WinnerDialog";
import SettingsDialog from "./SettingsDialog";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    settings: {position: 'absolute', top: '80px', right: '20px'},
    roomCode: {paddingRight: '10px', paddingTop: '10px'},
    all_avatars: {position: 'absolute', left: '20px', top: '80px'},
    team_choose: {
        position: 'absolute',
        top: '75px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        textAlign: 'center',
    },
    teamsContainer: {
        direction: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        transform: 'translate(0, 25%)',
        columnGap: theme.spacing(3),
    },
    gameCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    wordCards: {
        flexGrow: 1,
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
}))


export default function RoomPage(props) {
    const [me, setMe] = useState(false)
    const [comments, setComments] = useState([])
    const [room, setRoom] = useState({in_room: [], room_lead: [], room_words: []})
    const [settings, setSettings] = useState(false)

    const [winner, setWinner] = useState(null)

    const classes = useStyles()
    const room_code = props.match.params.room
    useEffect(() => {
            const interval = setInterval(() => {
                let requestOptions = {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        room_code: room_code,
                    })
                }
                fetch('/api/game', requestOptions)
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        } else {
                            props.history.push('/')
                        }
                    })
                    .then(data => {
                        setRoom(data.room)
                        setMe(data.me);
                        setComments(data.comments);
                        setWinner(data.room.winner);
                    })
                    .catch(error => {
                        console.log('Error', error)
                    })
            }, 1000)
            return () => clearInterval(interval);
        }, []);


    function leaveRoom() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: room.room,
            })
        }
        fetch('/api/leave-game', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log('Bad-Response: Unable to delete')
                }
            })
        props.history.push('/')
    }


    function chooseTeam() {
        return (<div className={classes.team_choose}
                     style={{right: (me && me.is_host) ? '30%' : '0'}}>
            <Typography align='center' variant="h4">Choose your team</Typography>
        </div>)
    }


    function handleGuess(word) {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: room_code,
                word: word.word,
                team: me.team,
            })
        }
        fetch('/api/guess-word', requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.log('Error', error)
                }
            })
    }

    function handlerShuffle() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: room_code,
            })
        }
        fetch('/api/mix-players', requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.log('Error', error)
                }
            })
    }


    return (
        <div className={classes.root}>
            <WinnerDialog
                leaveRoom={leaveRoom}
                winner={winner}
                room={room}
            />
            {(room.in_room.length === 0) ? null :
                <SettingsDialog
                    settings={settings}
                    setSettings={setSettings}
                    room={room}
                />
            }
            <Header/>
            <div className={classes.all_avatars}>
                {(<AvatarPlayers players={room.in_room} me={me} team={0}/>)}
            </div>
            <Slide in={me && me.team === 0} direction='down'>
                {chooseTeam()}
            </Slide>
            <Grid container spacing={3}>
                <Grid container spacing={3} className={classes.teamsContainer}>
                    <Grid item xs={5}>
                        <CardTeam all_players={room.in_room}
                                  me={me}
                                  team={1}
                                  room={room}
                                  comments={comments}
                                  start={room.start}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <CardTeam all_players={room.in_room}
                                  me={me}
                                  team={2}
                                  room={room}
                                  comments={comments}
                                  start={room.start}
                        />
                    </Grid>
                </Grid>
                <Grid className={classes.gameCard} item xs={12}>
                    <Game ready={me.ready}
                          all_players={room.in_room}
                          me={me}
                          room={room}
                          start={room.start}
                    />

                </Grid>
            </Grid>
            <Grid container className={classes.settings} justify='flex-end' alignItems='flex-start'>
                <Typography variant='h7' className={classes.roomCode}>Code: {room_code}  </Typography>
                {(room.start) ? null :
                    <Button variant='contained' onClick={() => handlerShuffle()}>Shuffle</Button>
                }
                {(me && me.is_host) ?
                    <Button variant='contained' onClick={() => setSettings(true)}><Build/></Button>
                    : null}
                <Button variant='contained' onClick={() => leaveRoom()}><ExitToApp/></Button>
            </Grid>
            {(room.room_words.length !== 0 && me && room.timer) ?
                <Grid container className={classes.wordCards} spacing={1}>
                    {(room.room_words.slice(-7, room.room_words.length).map((word, index) => (
                        <Grid key={index} item>
                            <WordCard room={room}
                                      index={index}
                                      word={word}
                                      lead={room.room_lead[0].player.user.id === me.user.id}
                                      handleGuess={handleGuess}
                            />
                        </Grid>)))}
                </Grid>
                : null}
        </div>
    )

}