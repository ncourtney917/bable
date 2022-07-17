import Popup from 'reactjs-popup';

export function ErrorMessage() {
    return(
        <Popup defaultOpen="true" position="top center" arrow="false">
            <div className="error" id="errorMessage">
                <h2>Not a valid name!</h2>
                <h3>(According to the US database of baby names)</h3>
            </div>
        </Popup>
    )
};