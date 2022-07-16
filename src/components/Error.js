import Popup from 'reactjs-popup';

export function ErrorMessage() {
    return(
        <Popup defaultOpen="true" position="top center" arrow="false">
            <div className="error">
                <h3>Not a valid name. Guess again!</h3>
            </div>
        </Popup>
    )
};