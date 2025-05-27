def is_leap_year(year):
    # Rule 1: The year must be divisible by 4
    if year % 4 != 0:
        return False
    
    # Rule 2: If the year is a century year, it must be divisible by 400
    if year % 100 == 0 and year % 400 != 0:
        return False
        
    # If we've passed both checks, it's a leap year
    return True

# Test with some examples
test_years = [1600, 1700, 1712, 1800, 1900, 2000, 2016, 2024, 2100]
for year in test_years:
    if is_leap_year(year):
        print(f"{year} is a leap year")
    else:
        print(f"{year} is not a leap year")

# Function that takes user input
def check_user_year():
    year = int(input("Enter a year to check if it's a leap year: "))
    if is_leap_year(year):
        print(f"{year} is a leap year")
    else:
        print(f"{year} is not a leap year")

# Uncomment the line below to take user input
check_user_year()