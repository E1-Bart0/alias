import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


export default function ImageCard(props) {
    let delta = 0
    let color = '#000'
    let margin_delta = 0
    const width = 200
    const height = 250
    const margin = 20

    if (props.current_diff === props.difficulty) {
        delta = 60
        color = '#ff0000'
        margin_delta = -10
    }

    const useStyles = makeStyles({
        root: {
            width: width + delta,
            height: height + delta,
            margin: margin + margin_delta,
            color: color,
        },
        media: {
            height: height - 50 + delta,
        },
        content: {
            margin: 0,
            padding: 0,
        }
    });
    const classes = useStyles();

    return (
        <Card className={classes.root} elevation={7}
              onClick={() => props.ClickEvent(props.difficulty)}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.image}
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" com
                                ponent="h2" align='center'>
                        {(props.current_diff === props.difficulty) ?
                            `${props.difficulty.toUpperCase()} WORDS` :
                            `${props.difficulty} words`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" align='right'>
                        Choose difficulty
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}