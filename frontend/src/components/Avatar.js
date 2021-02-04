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
            border: (props.team === 0 || props.ready) ? 'none' : '2px solid red',
            margin: (props.team === 0 || props.ready) ? 'none' : '-2px',
            width: (props.small) ? theme.spacing(4) : null,
            height: (props.small) ? theme.spacing(4) : null,
        }),
    }));

    let counter = 0;

    let results = (props.players || []).map((player, index) => {
        const classes = useStyles({
            color: player.user.color,
            ready: (player.ready == null) ? true : player.ready,
            team: player.team,
            small: props.small,
        });
        counter += 1;
        if (index + 1 === props.players.length) {
            for (let i = 0; i < 10 - counter; i++) {
                const classes = useStyles({
                    color: player.user.color,
                });
            }
            counter = 0;
        }
        if (!props.team || props.team === player.team) {
            return (<Avatar className={classes.root} key={index}>{slice_name(player.user.name)}
            </Avatar>)
        }
    })
    return (
        <AvatarGroup max={8} align='center'>
            {results}
        </AvatarGroup>
    )

}