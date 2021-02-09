import React, {useState} from "react";
import {Card, Slide} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CardWaiting from "./CardWaiting";
import GameCard from "./GameCard";


export default function Game(props) {
    const useStyles = makeStyles((theme) => ({
            root: {
                position: "absolute",
                width: '30%', height: "330px",
                border: (props.room.room_lead.length !== 0) ?
                    `2px solid ${props.room.room_lead[0].player.user.color}`
                    : null
            }
        }
    ))

    const classes = useStyles()

    function handleStart() {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: props.room.room,
            })
        }
        fetch('/api/game-start', requestOptions)
            .then((response) => response.json())

    }


    return (
        <Slide in={props.ready}
               direction='up'
               style={{transformOrigin: '0 0 0'}}
               {...(props.ready ? {timeout: 1000} : {})}>
            <Card className={classes.root} elevation={7}>
                {!(props.room.start && props.room.room_lead.length !==0 && props.me) ?
                    <CardWaiting
                        ready={props.ready}
                        all_players={props.room.in_room}
                        me={props.me}
                        room={props.room}
                        handleStart={handleStart}
                    />
                    : <GameCard
                        room={props.room}
                        lead={props.room.room_lead[0].player.user.id === props.me.user.id}
                        leader={props.room.room_lead[0].player}
                        next_player={handleStart}
                        new_words={props.new_words}
                    />

                }
            </Card>
        </Slide>
    )
}

