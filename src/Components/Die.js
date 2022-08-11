import React from "react"


export default function Die(props) {

    const styles = {
        backgroundColor: props.toggled ? "#2ee370" : "#332e2e",
        color: props.toggled ? "#332e2e" : "white",
    }

    return(
        <div className="dieBox" style={styles} onClick={() => props.handleClick()}>
            <h2>{props.value}</h2>
        </div>
    )
}
