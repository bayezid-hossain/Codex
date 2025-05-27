def fridge_space_optimization(fridge_dimensions, drinks):
    # Initialize result structure
    result = {
        "shelf_contents": [[] for _ in range(len(fridge_dimensions))],
        "shelf_usage": [{"occupied": 0.00} for _ in range(len(fridge_dimensions))],
        "total_fridge_occupied": 0.00,
    }

    # Track remaining width on each shelf
    remaining_width = [shelf["width"] for shelf in fridge_dimensions]

    # Process each drink type
    drink_index = 0
    while drink_index < len(drinks):
        drink = drinks[drink_index]
        drink_type = drink["type"]
        drink_width = drink["width"]
        drink_count = drink["count"]

        # Try to place drinks on each shelf
        drinks_placed = 0

        for shelf_index in range(len(fridge_dimensions)):
            # Calculate how many more drinks of this type can fit on this shelf
            can_fit = min(
                drink_count - drinks_placed, remaining_width[shelf_index] // drink_width
            )

            if can_fit > 0:
                # Update shelf contents
                found = False
                for item in result["shelf_contents"][shelf_index]:
                    if item["type"] == drink_type:
                        item["count"] += can_fit
                        found = True
                        break

                if not found:
                    result["shelf_contents"][shelf_index].append(
                        {"type": drink_type, "count": can_fit}
                    )

                # Update remaining width
                remaining_width[shelf_index] -= can_fit * drink_width
                drinks_placed += can_fit

            # If all drinks are placed, move to next drink type
            if drinks_placed == drink_count:
                break

        drink_index += 1

    # Calculate shelf usage percentages
    total_width = sum(shelf["width"] for shelf in fridge_dimensions)
    total_used = 0

    for shelf_index in range(len(fridge_dimensions)):
        shelf_width = fridge_dimensions[shelf_index]["width"]
        used_width = shelf_width - remaining_width[shelf_index]
        shelf_percentage = (used_width / shelf_width) * 100
        result["shelf_usage"][shelf_index]["occupied"] = round(shelf_percentage, 2)
        total_used += used_width

    # Calculate total fridge usage percentage
    result["total_fridge_occupied"] = round((total_used / total_width) * 100, 2)

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
        {"height": 300, "width": 420},
    ]
    drinks = [
        {"type": "Can", "height": 122, "width": 66, "count": 7},
        {"type": "Mini_Can", "height": 100, "width": 50, "count": 3},
        {"type": "Small_Bottle", "height": 188, "width": 56, "count": 1},
        {"type": "Large_Bottle", "height": 203, "width": 63, "count": 1},
    ]

    output = fridge_space_optimization(fridge_dimensions, drinks)
    print("Output: ", output)
