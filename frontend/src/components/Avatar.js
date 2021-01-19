import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {AvatarGroup} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core";



export default function PlayerAvatar(props) {

    function slice_name(name) {
        return (name === null) ? '' : (name.length > 1) ? name.slice(0, 2) : name
    }

    const useStyles = makeStyles((theme) => ({
        root: props => ({
            color: theme.palette.getContrastText(props.color),
            backgroundColor: props.color,
            border: '1px solid red'
        }),
    }));

    let counter = 0;
    let results = (props.players || []).map((player, index) => {
        const classes = useStyles({color: player.color});
        counter += 1;
        if (index + 1 === props.players.length) {
            for (let i = 0; i < 10 - counter; i++) {
                const classes = useStyles({color: player.color});
            }
            counter = 0;
        }
        if (props.team === player.team) {
            return (<Avatar className={classes.root} key={index}>{slice_name(player.name)}
            </Avatar>)
        }
    })


    return (
        <AvatarGroup max={8} align='center'>
            {results}
        </AvatarGroup>
    )
}