import { useState, CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";

function Spinner() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    return (
        <div className="sweet-loading flex flex-col md:flex-row justify-center" style={{marginTop: "16px"}}>
            <BeatLoader color={color} loading={loading} size={16} />
        </div>
    );
}

export default Spinner;