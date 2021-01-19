import React from "react";
import {Card, CardActions, CardHeader, Grid, IconButton, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Favorite} from "@material-ui/icons";
import AvatarPlayers from "./Avatar";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";


export default function CardTeam(props) {
    const title = `Team ${props.team}`

    const useStyles = makeStyles((theme) => ({
        cardTeam: {
            width: '40%', height: '60%', margin: '4%',
            border: (props.me.team === props.team) ?
                `2px solid ${props.me.color}` :
                `2px solid red`,
            background: (props.me.team === props.team) ?
                'linear-gradient(315deg, #ffcfdf 0%, #b0f3f1 74%)' :
                'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        },
        avatarIcons: {
            display: 'grid',
            position: 'relative',
            left: '25%',
        }

    }))
    const classes = useStyles()


    return (
        <Card elevation={5} className={classes.cardTeam}>
            <CardHeader
                title={title}
                align='center'>
            </CardHeader>
            <Grid align='center'>
                <Grid className={classes.avatarIcons}>
                    <AvatarPlayers players={props.all_players} team={props.team}/>
                </Grid>
                {(props.me.team === props.team) ? null :
                    <IconButton onClick={() => props.setTeam(props.team)}>
                        <Favorite/>
                    </IconButton>}
            </Grid>
            <CardMedia
                className={classes.media}
                image=""
                title="Paella dish"/>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    This impressive paella is a perfect party dish and a fun meal to cook together with your
                    guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
            </CardActions>
        </Card>
    )

}