import React from "react";
import DraggableIngredientsBox from "./DraggableIngredientsBox";

const CraftContainer = ({craftedItems, addCraftedItems, addIngredients, removeIngredients, removeCraftedItems}) => {
    return (
        <div className="craft-container">
            {craftedItems.map((craftedItem, index) => (
                <DraggableIngredientsBox 
                    key={index} name={craftedItem} 
                    elementId={`${craftedItem}${index}`} 
                    addCraftedItems={addCraftedItems}
                    addIngredients={addIngredients}
                    removeIngredients={removeIngredients}
                    removeCraftedItems={removeCraftedItems}
                />
            ))}
        </div>
    )
}

export default CraftContainer;