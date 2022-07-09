import pytest
from utill import *
def test_method():
    assert isValidPlate("MM-AA1123") == True
    assert isValidPlate("MM-AA0123") == False
    assert isValidPlate("-AA0123") == False
    assert isValidPlate("MM-1123") == False
    assert isValidPlate("MMAA1123") == False
    assert isValidPlate("MMMM-AA1123") == False
    assert isValidPlate("MM-AAAA1123") == False
    assert isValidPlate("MM-AA11235") == False

def test_method2():
    assert isEmpty("") == True
    assert isEmpty("  ") == True
    assert isEmpty(".") == False

def test_method3():
    assert isValidDate("2020-09-18T05:05:05Z") == True
    assert isValidDate("2020-09-18T05:05:05") == False
    assert isValidDate("2020-09-18T25:05:05Z") == False
    assert isValidDate("2020-09-18T05:61:05Z") == False
    assert isValidDate("2020-09-18T05:05:61Z") == False
    assert isValidDate("2020-13-18T05:05:05Z") == False
