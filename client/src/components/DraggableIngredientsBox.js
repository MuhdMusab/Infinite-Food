import React, { useState, useRef } from "react";
import useDragger from "../hooks/useDragger";

const DraggableIngredientsBox = (props) => {
    useDragger(props);

    return (
        <div id={props.elementId} className={`ingredients-box draggable`}>
            {props.name}
        </div>
    )
}

export default DraggableIngredientsBox;