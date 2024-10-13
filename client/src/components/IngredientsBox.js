import React, { useState, useRef } from "react";

const IngredientsBox = (props) => {
    const componentRef = useRef(null);

    const handleClick = (event) => {
        if (componentRef.current) {
            const { width, height } = componentRef.current.getBoundingClientRect();
            console.log(`Width: ${width}px, Height: ${height}px`);
        }
        props.addCraftedItems(event.currentTarget.textContent);
        console.log(event.currentTarget.textContent);
    }

    return (
        <div className="ingredients-box" ref={componentRef} onClick={handleClick}>
            {props.name}
        </div>
    )
}

export default IngredientsBox;