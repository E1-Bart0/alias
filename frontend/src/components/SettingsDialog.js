import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CreatePage from "./CreateRoomPage";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            margin: 'auto',
            width: 'fit-content',
            height: 'fit-content',
        },
    content: {
            maxHeight: '60%'
    }
    })
)

export default function SettingsDialog(props) {
    const [diff, setDiff] = useState(props.room.difficulty)
    const [words, setWords] = useState(props.room.words_amount)
    const classes = useStyles()

    function applyChanges() {
        const request_option = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: props.room.room,
                difficulty: diff,
                words_amount: words,
            })
        }
        fetch('/api/create-room', request_option)
            .then((response) => {
                if (!response.ok) {
                    console.log('Error to Change');
                }
            })
        props.setSettings(false)
    }

    return (
        <div>
            <Dialog
                className={classes.root}
                disableBackdropClick
                disableEscapeKeyDown
                open={props.settings}
                fullWidth={true}
                maxWidth='500px'
                maxHeight='500px'
            >
                <DialogContent>
                    <CreatePage
                        dialog={true}
                        words_amount={words}
                        diff={diff}
                        setWords={setWords}
                        setDiff={setDiff}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setSettings(false)} color="primary">
                        Back
                    </Button>
                    <Button onClick={() => applyChanges()} color="primary" autoFocus>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}