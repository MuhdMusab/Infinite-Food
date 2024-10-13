import React, {useState} from "react";
import CraftContainer from './CraftContainer';
import IngredientsContainer from './IngredientsContainer';

const MainContainer = () => {
    const [craftedItems, setCraftedItems] = useState([]);
    const [ingredients, setIngredients] = useState([
        "potato🥔", "cheese🧀", "rice🍚", 
        "egg🥚", "milk🥛", "fruit🍎", 
        "vegetable🥦", "chicken🐔", "beef🐄",
        "fish🐟", "pork🐖", 
        "red🔴", "blue🔵", "yellow🟡"
    ]);

    const addCraftedItems = (craftedItems) => {
        setCraftedItems(prev => [...prev, craftedItems])
    }

    const removeCraftedItems = (craftedItemToRemove) => {
        setCraftedItems((prevItems) => prevItems.filter(item => item !== craftedItemToRemove));
    };

    const addIngredients = (ingredients) => {
        setIngredients(prev => [...prev, ingredients])
    }

    const removeIngredients = (ingredientToRemove) => {
        setIngredients((prevIngredients) => prevIngredients.filter(item => item !== ingredientToRemove));
    };

    return (
        <div className="main-container">
            <CraftContainer 
                craftedItems={craftedItems}
                addCraftedItems={addCraftedItems}
                addIngredients={addIngredients}
                removeCraftedItems={removeCraftedItems}
                removeIngredients={removeIngredients}
            />
            <IngredientsContainer addCraftedItems={addCraftedItems} ingredients={ingredients}/>
        </div>
    )
}

export default MainContainer;