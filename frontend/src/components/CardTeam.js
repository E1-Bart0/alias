import React, {useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Grow,
    IconButton,
    Slide,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Favorite} from "@material-ui/icons";
import AvatarPlayers from "./Avatar";
import Comments from "./Comments";


export default function CardTeam(props) {
    const [visible, setVisible] = useState(false)
    const title = `Team ${props.team}`

    const useStyles = makeStyles((theme) => ({
        cardTeam: {
            borderRadius: '20px',
            position: 'relative',
            minHeight: (props.start) ? (visible) ? '350px' : '300px' : (visible) ? '400px' : '350px',
            border: (props.me.team === props.team) ?
                `2px solid ${props.me.user.color}` :
                `2px solid red`,
            background: (props.me.team === props.team) ?
                'linear-gradient(315deg, #ffcfdf 0%, #b0f3f1 74%)' :
                'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        },
        container: {
            position: 'absolute',
            flexGrow: 1,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            top: (visible) ? '15%' : '4%',
            padding: 0,
        },
        commentBox: {
            position: 'absolute',
            bottom: '3%',
            marginLeft: '-20px',
        },
        counter: {
            position: 'absolute',
            top: '13%',
            right: '10%'
        }

    }))
    const classes = useStyles()

    function updateRoomReady(team, ready) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: props.room.room,
                team: team,
                ready: ready,
            })
        }
        fetch('/api/game', requestOptions)
            .then(response => response.json())
            .catch(error => {
                console.log('Error', error)
            })
    }

    return (
        <Slide in={props.team}
               direction={(props.team === 1) ? 'right' : 'left'}
               style={{transformOrigin: '0 0 0'}}
               {...(props.team ? {timeout: 1000} : {})}>
            <Card elevation={5} className={classes.cardTeam}
                  onPointerEnter={() => setVisible(true)}
                  onPointerLeave={() => setVisible(false)}
            >
                <Grow in={visible}>
                    <CardHeader
                        title={title}
                        align='center'>
                    </CardHeader>
                </Grow>
                <Typography variant='h7' className={classes.counter}>
                    {(props.team === 1) ? props.room.team_1 : props.room.team_2}/{props.room.words_amount}
                </Typography>
                <CardContent style={{padding: 0}}>
                    <Grid container spacing={2} direction='column'
                          className={classes.container}>
                        <Grid item xs={12} justify='center' align='center'>
                            <AvatarPlayers players={props.all_players} team={props.team}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: '-5px'}}>
                            {(props.start) ? null : (props.me.team === props.team) ?
                                <Button onClick={() => updateRoomReady(props.team, !props.me.ready)}
                                        variant='contained' color='default'>
                                    {(props.me.ready) ? 'UnReady' : 'Ready'}
                                </Button> :
                                <IconButton onClick={() => updateRoomReady(props.team, false)}>
                                    <Favorite/>
                                </IconButton>}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container spacing={3} className={classes.commentBox}
                          justify='center' alignItems='center'>
                        <Grid item xs={11}>
                            <Comments me={props.me}
                                      team={props.team}
                                      all_players={props.all_players}
                                      room={props.room.room}
                                      comments={props.comments}
                            />
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Slide>
    )
}