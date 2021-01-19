import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import {ChromePicker} from "react-color";
import {Collapse, FormHelperText, IconButton, TextField} from "@material-ui/core";
import {ArrowDropUp} from "@material-ui/icons";


export default function AvatarNameInput(props) {
    const [name, setName] = useState(props.name);
    const [color, setColor] = useState(props.color)
    const [visible, setVisible] = useState(false)
    const [errorsMsg, setErrors] = useState(null)
    const [successMsg, setSuccess] = useState(null)

    const handleChangeColor = (color) => {
        setColor(color.hex)
    }
    const handleChange = (event) => {
        setName(event.target.value);
    };
    const handleVisible = (value) => {
        setVisible(value);
        if (!value) {
            updateNameColor();
        }
    }

    function updateNameColor() {
        const request_option = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                color: color,
            }),
        };
        fetch('/api/player', request_option)
            .then((response) => {
                if (response.ok) {
                    setSuccess('Color Updated');
                } else {
                    setErrors('Error Update');
                }
            })
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        mix_color: {
            color: theme.palette.getContrastText(color),
            backgroundColor: color,
        },
        arrow: {
            margin: 'right',
            top: '50%'
        },
        open: {
            height: 250,
        }
    }));
    const classes = useStyles();

    function slice_name(name) {
        return (name === null) ? '' : (name.length > 1) ? name.slice(0, 2) : name
    }

    function changingColor() {
        return (<div>
            <Collapse in={visible} className={classes.open}>
                <ChromePicker color={color} onChange={handleChangeColor}/>
            </Collapse>
        </div>)
    }


    if (errorsMsg) {
        return (errorsMsg)
    }
    return (
        <div className={classes.root}>
            <form>
                <Avatar className={classes.mix_color}
                        onClick={() => handleVisible(!visible)}>
                    {slice_name(name)}
                </Avatar>
                {(props.color === null) ? <FormHelperText>
                    <div align="center">Press to choose color</div>
                </FormHelperText> : null}
                <Collapse in={visible}>
                    <IconButton className={classes.arrow} color='black' aria-label='up'
                                onClick={() => handleVisible(false)}>
                        <ArrowDropUp/>
                    </IconButton>
                </Collapse>
            </form>
            {(visible) ? changingColor() : null}
            <form noValidate autoComplete="off">
                <TextField id="nickname" label="Your nickname" value={name}
                           color="secondary" required={true}
                           onChange={handleChange}
                           inputProps={{maxLength: 20,}}
                           onBlur={() => {
                               updateNameColor()
                           }}
                />
            </form>
        </div>
    )
}