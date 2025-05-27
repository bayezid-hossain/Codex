def fridge_space_optimization(fridge_dimensions, drinks):
    """
    Optimizes fridge space by placing drinks on shelves in the most efficient way.

    Args:
        fridge_dimensions: A list of dictionaries representing each shelf's dimensions (height, width).
        drinks: A list of dictionaries representing each drink type, its dimensions, and the quantity available.

    Returns:
        A dictionary containing the following:
            - shelf_contents: A list of lists, where each inner list represents the drinks on a shelf.
            - shelf_usage: A list of dictionaries, each containing the percentage of space occupied on a shelf.
            - total_fridge_occupied: The overall percentage of the fridge's space occupied.
    """

    result = {
        "shelf_contents": [[] for _ in range(len(fridge_dimensions))],
        "shelf_usage": [{"occupied": 0.00} for _ in range(len(fridge_dimensions))],
        "total_fridge_occupied": 0.00,
    }

    remaining_drinks = list(drinks)

    for shelf_index, shelf_dim in enumerate(fridge_dimensions):
        shelf_width = shelf_dim["width"]
        current_shelf_occupied = 0

        placed_drinks_on_shelf = []
        next_remaining_drinks = []

        for drink in remaining_drinks:
            total_drink_width = drink["width"] * drink["count"]
            if current_shelf_occupied + total_drink_width <= shelf_width:
                result["shelf_contents"][shelf_index].append(
                    {"type": drink["type"], "count": drink["count"]}
                )
                current_shelf_occupied += total_drink_width
                placed_drinks_on_shelf.append(drink)
            else:
                next_remaining_drinks.append(drink)

        if shelf_width > 0:
            result["shelf_usage"][shelf_index]["occupied"] = round(
                (current_shelf_occupied / shelf_width) * 100, 2
            )
        else:
            result["shelf_usage"][shelf_index]["occupied"] = 0.00

        remaining_drinks = next_remaining_drinks

    total_fridge_width = sum(shelf["width"] for shelf in fridge_dimensions)
    total_occupied_width = 0

    for i, shelf_content in enumerate(result["shelf_contents"]):
        shelf_width = fridge_dimensions[i]["width"]
        shelf_occupied_width = 0
        for item in shelf_content:
            drink = next((d for d in drinks if d["type"] == item["type"]), None)
            if drink:
                shelf_occupied_width += drink["width"] * item["count"]
        total_occupied_width += shelf_occupied_width

    if total_fridge_width > 0:
        result["total_fridge_occupied"] = round(
            (total_occupied_width / total_fridge_width) * 100, 2
        )
    else:
        result["total_fridge_occupied"] = 0.00

    return result


if __name__ == "__main__":
    # fridge_dimensions = [
    #     {"height": 300, "width": 700},
    #     {"height": 300, "width": 700},
    #     {"height": 300, "width": 700},
    # ]
    # drinks = [
    #     {"type": "Can", "height": 122, "width": 66, "count": 5},
    #     {"type": "Mini_Can", "height": 100, "width": 50, "count": 3},
    #     {"type": "Small_Bottle", "height": 188, "width": 56, "count": 3},
    #     {"type": "Large_Bottle", "height": 203, "width": 63, "count": 5},
    # ]

    # output = fridge_space_optimization(fridge_dimensions, drinks)
    # print("Output: ", output)

    fridge_dimensions = [
        {"height": 300, "width": 100},
        {"height": 300, "width": 200},
        {"height": 300, "width": 400},
    ]
    drinks = [
        {"type": "Can", "height": 122, "width": 66, "count": 7},
        {"type": "Mini_Can", "height": 100, "width": 50, "count": 3},
        {"type": "Small_Bottle", "height": 188, "width": 56, "count": 1},
        {"type": "Large_Bottle", "height": 203, "width": 63, "count": 1},
    ]

    output = fridge_space_optimization(fridge_dimensions, drinks)
    print("Output: ", output)
