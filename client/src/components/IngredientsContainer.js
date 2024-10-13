import React, {useState} from "react";
import IngredientsBox from "./IngredientsBox";

const IngredientsContainer = ({addCraftedItems, ingredients}) => {
    return (
        <div className="ingredients-container">
            {ingredients.map((ingredient, index) => (
                <IngredientsBox key={index} name={ingredient} addCraftedItems={addCraftedItems} ingredients={ingredients}/>
            ))}

        </div>
    )
}

export default IngredientsContainer;