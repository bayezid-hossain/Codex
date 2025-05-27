import re

filename = "123_document"
filename2 = "23_document"
if re.match(r"^1", filename2):
    # Do something with files that start with '1'
    print(filename2 + " does match the pattern")
else:
    print(filename2 + " does not match the pattern")
