import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, GridList, Typography} from "@material-ui/core";
import Header from "./Header";
import {makeStyles} from "@material-ui/core/styles";
import {Build, ExitToApp} from "@material-ui/icons";
import AvatarPlayers from "./Avatar";
import CardTeam from "./CardTeam";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    settings: {position: 'absolute', top: '80px', right: '20px'},
    roomCode: {paddingRight: '10px', paddingTop: '10px'},
    all_avatars: {position: 'absolute', left: '20px', top: '80px'},
    teams: {
        direction: 'row', alignItems: 'center',
        justifyContent: 'center', align: 'center'
    },
    team_choose: {position: 'absolute', right: '50%', top: '80px', transform: 'translate(50%)'}
}))


export default function RoomPage(props) {
    const [error, setError] = useState(null)
    const [all_players, setPlayers] = useState(null)
    const [me, setMe] = useState(null)
    const [team, setTeam] = useState(0)

    const classes = useStyles()
    const room = props.match.params.room;

    useEffect(() => {
        const interval = setInterval(() => {
            let requestOptions = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    room_code: room,
                    team: team,
                })
            }
            fetch('/api/game', requestOptions)
                .then(response => response.json())
                .then(data => {
                    // console.log(data)
                    setPlayers(data.all_players)
                    setMe(data.player)
                })
                .catch(error => {
                    console.log('Error')
                    leaveRoom()
                })
        }, 1000)
        return () => clearInterval(interval);
    }, [team]);


    function leaveRoom() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: room,
            })
        }
        fetch('/api/leave-game', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    setError('Bad-Response: Unable to delete')
                }
            })
        props.leaveRoom()
        props.history.push('/')
    }

    function handleChangeTeam(value) {
        setTeam(value)
    }

    function chooseTeam() {
        return (<div className={classes.team_choose}>
            <Typography align='center' variant="h4">Choose your team</Typography>
        </div>)
    }

    return (
        <div className={classes.root}>
            <Header/>
            <div className={classes.settings}>
                <ButtonGroup>
                    <Typography variant='h7' className={classes.roomCode}>Code: {room}  </Typography>
                    <Button variant='contained'><Build/></Button>
                    <Button variant='contained' onClick={() => leaveRoom()}><ExitToApp/></Button>
                </ButtonGroup>
            </div>
            <div className={classes.all_avatars}>
                {(<AvatarPlayers players={all_players} team={0}/>)}
            </div>
            {(me && me.team === 0) ? chooseTeam() : null}
            {(me) ? (
                <GridList className={classes.teams}>
                    <CardTeam all_players={all_players} me={me}
                              team={1}
                              setTeam={handleChangeTeam}/>
                    <CardTeam all_players={all_players} me={me}
                              team={2}
                              setTeam={handleChangeTeam}/>
                </GridList>) : null}
        </div>
    )

}