Feature: Build a string from two strings

    The resulting string contains letters common in both input strings.
    In the resulting string, letters are ordered alphabetically.
    Each letter is followed by a number which represents how many times
    the letter in the strings and is always lower than the number
    of the previous letter. Numbers appear in descending
    order and are greater than zero.

    Scenario: Empty strings return an empty string.

        Given The first string is empty
        Given The second string is empty
        When the function uses the two strings
        Then the result is an empty string ""

    Scenario: One of the strings is empty
        Given The first string is empty
        Given The second string contains letters
        When the function uses the two strings
        Then The result is an empty string ""

    Scenario: Different strings result in an empty string
        Given the first string is "a"
        Given the second string is "b"
        When the function gets the two strings
        Then the result is an empty string ""

    Scenario: Strings with common letters result is correct string
        Given the first string is "bab"
        Given the second string is "aab"
        When the function gets the two strings
        Then the result is "a2b1"