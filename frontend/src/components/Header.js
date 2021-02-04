import React, {useEffect, useState} from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Help} from "@material-ui/icons";
import AvatarNameInput from "./AvatarNameInput";

const useStyles = makeStyles((theme) => ({
    root: {display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',},
    appbar: {position: 'fixed', background: 'whitesmoke', color: 'red',},
    appbarTitle: {flexGrow: '1',},
    appbarWrapper: {width: '80%', margin: '0 auto'}
}))


export default function Header(props) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [color, setColor] = useState(null);


    useEffect(() => {
        fetch('/api/player')
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setColor(data.color);
            })
            .catch(error => console.log('Error'))
    }, []);


    function AvatarName() {
        if (color != null) {
            return (
                <AvatarNameInput name={name} color={color}/>)
        }
    }


    return (
        <div className={classes.root}>
            <AppBar className={classes.appbar}>
                <Toolbar className={classes.appbarWrapper}>
                    <Typography className={classes.appbarTitle} variant='h4'>Alias</Typography>
                    {AvatarName()}
                    <IconButton edge='start' color='black' aria-label='menu'>
                        <Help/>
                    </IconButton>

                </Toolbar>
            </AppBar>
        </div>
    )

}