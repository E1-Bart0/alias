import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Divider, Grid, IconButton, InputAdornment, List, ListItem, Paper, TextField} from "@material-ui/core";
import AvatarPlayers from "./Avatar";
import {Send} from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '20px',
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '230px',
        background: 'linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0.3))'
    },
    inputField: {
        marginBottom: '2%',
    },
    avatar: {
        paddingRight: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    listComments: {
        width: '100',
        position: 'relative',
        align: 'center',
        overflow: 'hidden',
        maxHeight: 135,
        marginTop: '20px',
    },
}))
export default function Comments(props) {
    const classes = useStyles()
    const [text, setText] = useState('')
    const scrollRef = useRef(null);
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behaviour: "smooth"});
        }
    }, [comments]);

    function create_comment() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: props.room,
                text: text,
                visible: props.team,
            })
        }
        fetch('/api/create-comment', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                }
            })
    }

    useEffect(() => {
        setComments(
            (props.comments || []).map((comment) => {
                if (comment.visible === props.team) {
                    return (
                        <ListItem ref={scrollRef}>
                            <Grid
                                item justify='center' alignItems='center' align='center'>
                                <TextField
                                    id="outlined-read-only-input"
                                    label={comment.user.name}
                                    defaultValue={comment.text}
                                    variant="outlined"
                                    type={(props.me.team === props.team) ? null : 'password'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AvatarPlayers players={[comment]} small={true}/>
                                            </InputAdornment>),
                                        readOnly: true,
                                    }}/>
                            </Grid>
                        </ListItem>)
                }
            }))
    }, [props.comments])


    if (!props.me) {
        return null
    }
    return (
        <Paper className={classes.root} elevation={5}>
            <Grid container spacing={1} alignItems='center' justify='center'>
                <Grid container item xs={12}
                      direction='row-reverse'
                      justify='center'>
                    <List className={classes.listComments}>
                        {comments}
                    </List>
                </Grid>
                <Grid className={classes.inputField}
                      container item xs={12}
                      alignItems="flex-end" justify='center'>
                    <Grid item className={classes.avatar}>
                        <AvatarPlayers players={[props.me]}/>
                    </Grid>
                    <Divider className={classes.divider} orientation='vertical'/>
                    <Grid item>
                        <TextField id="input-with-icon-grid"
                                   label="Your comment"
                                   onChange={event => setText(event.target.value)}
                                   noValidate autoComplete="off"
                        />
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => {
                            (text) ? create_comment() :
                                null
                        }}>
                            <Send/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}