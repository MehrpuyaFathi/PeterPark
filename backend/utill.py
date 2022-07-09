import re
from datetime import datetime
def isEmpty(var):
    return var == None or var == "" or var.isspace()

def isValidPlate(plate):
    regex = r"^[a-zA-Z]{1,3}-[a-zA-Z]{1,2}[1-9]\d{0,3}$"
    return bool(re.match(regex,plate))

def isValidDate(date_text):
    try:
        return bool(datetime.strptime(date_text, '%Y-%m-%dT%H:%M:%SZ'))
    except ValueError:
        return False
