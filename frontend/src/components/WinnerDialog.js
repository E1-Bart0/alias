import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function WinnerDialog(props) {

    function restartGame() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room_code: props.room.room,
            })
        }
        fetch('/api/restart-game', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log('Bad-Response: Unable to restart')
                }
            })
    }


    return (
        <div>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={props.winner}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Win {props.room.winner}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Team 1 Score: {props.room.team_1}
                        Team 2 Score: {props.room.team_2}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.leaveRoom()} color="primary">
                        leave
                    </Button>
                    <Button onClick={() => restartGame()} color="primary" autoFocus>
                        Restart Game
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}