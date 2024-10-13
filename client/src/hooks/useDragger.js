import React, { useEffect, useRef, useState } from "react";

let activeDraggerId = null;

function useDragger(props) {
    const isClicked = useRef(false);
    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    });
    const [isCombining, setIsCombining] = useState(false);

    useEffect(() => {
        const target = document.getElementById(props.elementId);
        if (!target) throw new Error("Element with given id doesn't exist");

        const container = target.parentElement;
        if (!container) throw new Error("Target element must have a parent");

        const parentBounds = container.getBoundingClientRect();

        const updateZIndex = () => {
            const { collidingElements, maxZIndexElement } = getCollidingElements(target, container);
            const filteredCollidingElements = collidingElements.filter(element => element == maxZIndexElement?.element);
            console.log(collidingElements)
            console.log(filteredCollidingElements)

            if (filteredCollidingElements.length === 0) {
                target.style.zIndex = 1;
            } else {
                const firstElement = filteredCollidingElements[0];
                if (firstElement) {
                    const zIndex = parseInt(window.getComputedStyle(firstElement).zIndex || '0', 10);
                    target.style.zIndex = zIndex + 1;
                }
            }
        }

        updateZIndex();

        const combine = async () => {
            console.log(isCombining)
            if (isCombining) return;
            console.log(isCombining)
            console.log(target)
            setIsCombining(true);

            const { collidingElements, maxZIndexElement } = getCollidingElements(target, container);
            console.log(maxZIndexElement)
            const filteredCollidingElements = collidingElements.filter(element => element == maxZIndexElement?.element);
            console.log(filteredCollidingElements)
            console.log(collidingElements)

            if (filteredCollidingElements.length > 0) {
                const firstElement = filteredCollidingElements[0];
                if (firstElement) {
                    await handleCombine(firstElement, target, props);
                }
                setIsCombining(false);
            } else {
                setIsCombining(false);
            }

            console.log(isCombining)
        }

        const onMouseDown = (e) => {
            // Check if another element is already being dragged
            if (activeDraggerId && activeDraggerId !== props.elementId) {
                return;
            }
            
            isClicked.current = true;
            activeDraggerId = props.elementId; // Set this element as the active dragger

            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;

            const rect = target.getBoundingClientRect();
            coords.current.lastX = rect.left;
            coords.current.lastY = rect.top;

            // Add a class to indicate this element is being dragged
            target.classList.add('dragging');
        };

        const onMouseUp = async (e) => {
            updateZIndex();
            console.log(e)
            if (activeDraggerId !== props.elementId) {
                return;
            }
            isClicked.current = false;
            activeDraggerId = null;

            console.log(e)
            coords.current.lastX = Math.min(coords.current.lastX + e.clientX - coords.current.startX, parentBounds.right);
            coords.current.lastY = Math.min(coords.current.lastY + e.clientY - coords.current.startY, parentBounds.bottom);

            target.classList.remove('dragging');
            await combine();
        };

        const onMouseMove = (e) => {
            if (activeDraggerId !== props.elementId) {
                return;
            }
            if (!isClicked.current) return;

            const xValue = e.clientX - coords.current.startX + coords.current.lastX;
            const yValue = e.clientY - coords.current.startY + coords.current.lastY;
            const nextX = Math.max(0, Math.min(xValue, parentBounds.right - 25));
            const nextY = Math.max(0, Math.min(yValue, parentBounds.bottom - 25));

            target.style.left = `${nextX}px`;
            target.style.top = `${nextY}px`;

            updateZIndex();
        };

        const onMouseOver = (e) => {
            target.classList.add('selected');
        }

        const onMouseLeave = (e) => {
            target.classList.remove('selected');
        }


        target.addEventListener("mousedown", onMouseDown);
        target.addEventListener("mouseover", onMouseOver);
        target.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

        return () => {
            target.removeEventListener("mousedown", onMouseDown);
            target.removeEventListener("mouseover", onMouseOver);
            target.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [props.elementId, isCombining]);

    function getCollidingElements(target, container) {
        const targetRect = target.getBoundingClientRect();
        const otherElements = container.children;
        const collidingElements = [];

        for (const element of otherElements) {
            if (element !== target) {
                const elementRect = element.getBoundingClientRect();
                if (targetRect.left < elementRect.right &&
                    targetRect.right > elementRect.left &&
                    targetRect.top < elementRect.bottom &&
                    targetRect.bottom > elementRect.top) {
                    collidingElements.push(element);
                }
            }
        }

        const maxZIndexElement = collidingElements.reduce((max, element) => {
            const zIndex = parseInt(window.getComputedStyle(element).zIndex || '0', 10);
            return (max === null || zIndex > max.zIndex) ? { element, zIndex } : max;
        }, null);

        return { collidingElements, maxZIndexElement };
    }
}

const handleCombine = async (firstElement, target, props) => {
    try {
        const input1 = firstElement.innerText.slice(0, -1);
        const input2 = target.innerText.slice(0, -1);
        const response = await fetch("http://localhost:3001/api/culinary-craft", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredient1: input1,
                ingredient2: input2,
            }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(input1);
        console.log(input2);
        console.log(data.result);
        props.addCraftedItems(data.result);
        props.addIngredients(data.result);
        props.removeCraftedItems(firstElement.innerText);
        props.removeCraftedItems(target.innerText);
    } catch (error) {
        console.error("Error posting data to API", error);
    }
};

export default useDragger;