package com.codearena.service;

import com.codearena.entity.Difficulty;
import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import com.codearena.entity.User;
import com.codearena.entity.Role;
import com.codearena.entity.AuthProvider;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.TestCaseRepository;
import com.codearena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Reset and clear all existing data to ensure IDs start from 1
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
            jdbcTemplate.execute("TRUNCATE TABLE test_cases");
            jdbcTemplate.execute("TRUNCATE TABLE problems");
            jdbcTemplate.execute("TRUNCATE TABLE users");
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
        } catch (Exception e) {
            testCaseRepository.deleteAll();
            problemRepository.deleteAll();
            userRepository.deleteAll();
            try {
                jdbcTemplate.execute("ALTER TABLE test_cases ALTER COLUMN id RESTART WITH 1");
                jdbcTemplate.execute("ALTER TABLE problems ALTER COLUMN id RESTART WITH 1");
                jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN id RESTART WITH 1");
            } catch (Exception ignored) {}
        }

        // Seed Admin user
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@codearena.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole(Role.ADMIN);
        admin.setAuthProvider(AuthProvider.LOCAL);
        userRepository.save(admin);

        List<SeededProblem> list = new ArrayList<>();
        
        // SET 1: Placement Basics (28 Questions)
        // ... (lines trimmed for space, targetContent will match below loop)
        // Let's replace the loop part where difficulty is defined and set.

        // SET 1: Placement Basics (28 Questions)
        add(list, "Vowel or Consonant Check", "Read a single character. Print 'VOWEL' if it is a vowel (case-insensitive), otherwise print 'CONSONANT'.", "a", "VOWEL", "z", "CONSONANT");
        add(list, "Alphabet Check", "Read a single character. Print 'ALPHABET' if it is an alphabetic letter, otherwise print 'NOT ALPHABET'.", "g", "ALPHABET", "5", "NOT ALPHABET");
        add(list, "ASCII Value of Character", "Read a single character and print its ASCII integer value.", "A", "65", "a", "97");
        add(list, "Number of Digits in Integer", "Read a single integer. Print the total count of its digits.", "12345", "5", "-500", "3");
        add(list, "Factorial of Number", "Read a single integer N. Print its factorial (N!).", "5", "120", "6", "720");
        add(list, "Fibonacci Series Up to N", "Read an integer N. Print the Fibonacci numbers from F(0) up to the largest Fibonacci number <= N, space-separated.", "5", "0 1 1 2 3 5", "10", "0 1 1 2 3 5 8");
        add(list, "Positive or Negative Number", "Read an integer. Print 'POSITIVE', 'NEGATIVE', or 'ZERO'.", "15", "POSITIVE", "-9", "NEGATIVE");
        add(list, "Even or Odd Check", "Read an integer. Print 'EVEN' if even, else 'ODD'.", "4", "EVEN", "11", "ODD");
        add(list, "Area of Circle", "Read an integer radius r. Print the area rounded down to the nearest integer (using PI = 3.14159).", "5", "78", "10", "314");
        add(list, "Area of Rectangle", "Read two space-separated integers representing length and width. Print the area.", "5 4", "20", "12 10", "120");
        add(list, "Area of Triangle", "Read two space-separated integers base and height. Print the integer area (base * height / 2).", "10 5", "25", "7 8", "28");
        add(list, "Sum of Digits of Number", "Read an integer. Print the sum of its digits.", "1234", "10", "987", "24");
        add(list, "Sum of N Natural Numbers", "Read an integer N. Print the sum of integers from 1 to N.", "5", "15", "100", "5050");
        add(list, "Sum in Range", "Read two space-separated integers a and b. Print the sum of integers between a and b (inclusive).", "5 10", "45", "1 100", "5050");
        add(list, "Reverse Given Number", "Read an integer. Print the number with digits reversed (no leading zeros).", "1230", "321", "4567", "7654");
        add(list, "LCM of Two Numbers", "Read two space-separated integers a and b. Print their Least Common Multiple.", "12 18", "36", "5 7", "35");
        add(list, "Strong Number Check", "Read an integer. Print 'YES' if it is a strong number (sum of the factorials of its digits equals the number), else 'NO'.", "145", "YES", "123", "NO");
        add(list, "Perfect Number Check", "Read an integer. Print 'YES' if it is a perfect number (sum of its positive divisors excluding itself equals the number), else 'NO'.", "6", "YES", "12", "NO");
        add(list, "Power of Number", "Read two space-separated integers: base and exponent. Print base raised to the power of exponent.", "2 5", "32", "5 3", "125");
        add(list, "Factors of Number", "Read an integer. Print all of its positive factors in ascending order, space-separated.", "12", "1 2 3 4 6 12", "7", "1 7");
        add(list, "Add Two Fractions", "Read four space-separated integers representing two fractions: n1 d1 n2 d2. Print their sum in simplified form (num/den).", "1 3 3 9", "2/3", "1 2 1 3", "5/6");
        add(list, "GCD of Two Numbers", "Read two space-separated integers a and b. Print their Greatest Common Divisor.", "12 18", "6", "17 5", "1");
        add(list, "Armstrong Number Check", "Read an integer. Print 'YES' if it is an Armstrong number (sum of cubes of digits equals the number), else 'NO'.", "153", "YES", "123", "NO");
        add(list, "Greatest of Two Numbers", "Read two space-separated integers. Print the larger value.", "10 20", "20", "-5 -1", "-1");
        add(list, "Greatest of Three Numbers", "Read three space-separated integers. Print the largest value.", "10 25 15", "25", "100 20 40", "100");
        add(list, "Leap Year Check", "Read an integer year. Print 'YES' if it is a leap year, else 'NO'.", "2020", "YES", "2021", "NO");
        add(list, "Prime Number Check", "Read an integer N. Print 'YES' if prime, else 'NO'.", "7", "YES", "8", "NO");
        add(list, "Palindrome Number Check", "Read an integer. Print 'YES' if it is a palindrome, else 'NO'.", "121", "YES", "123", "NO");

        // SET 2: Intermediate Placement Concepts (26 Questions)
        add(list, "Print Prime Numbers in Range", "Read two space-separated integers: low and high. Print all prime numbers in the range [low, high] space-separated.", "2 10", "2 3 5 7", "10 20", "11 13 17 19");
        add(list, "Print Armstrong Numbers in Interval", "Read two space-separated integers: low and high. Print all Armstrong numbers in range [low, high] space-separated.", "100 200", "153", "100 400", "153 370 371");
        add(list, "Express as Sum of Two Primes", "Read an integer N. Print 'YES' if N can be expressed as the sum of two prime numbers, else 'NO'.", "10", "YES", "11", "NO");
        add(list, "Replace All 0s with 1", "Read an integer. Print the integer with all occurrence of digit '0' replaced by '1'.", "10203", "11213", "500", "511");
        add(list, "Pyramid Pattern of Stars", "Read an integer height. Print a pyramid of stars ('*') of that height. Each line starts with spaces to align the stars.", "3", "  *\n ***\n*****", "2", " *\n***");
        add(list, "Pyramid Pattern of Numbers", "Read an integer height. Print a pyramid of numbers of that height. Each line starts with spaces for alignment.", "3", "  1\n 222\n33333", "2", " 1\n222");
        add(list, "Palindromic Pyramid Pattern", "Read an integer height. Print a palindromic numeric pyramid.", "3", "  1\n 121\n12321", "2", " 1\n121");
        add(list, "Maximum Handshakes", "Read an integer N representing the number of people. Print the maximum possible handshakes (N * (N - 1) / 2).", "10", "45", "5", "10");
        add(list, "Find Coordinate Quadrant", "Read two space-separated integers x and y. Print the quadrant (1, 2, 3, or 4) they lie in. If on axis, print 'AXIS'.", "5 5", "1", "-5 0", "AXIS");
        add(list, "Convert Number to Words", "Read a single digit integer (0-9). Print its word representation in title case.", "5", "Five", "0", "Zero");
        add(list, "Number of Days in Month", "Read two space-separated integers: month (1-12) and year. Print the number of days in that month.", "2 2020", "29", "4 2021", "30");
        add(list, "Permutations of N People in R Seats", "Read two space-separated integers: n and r. Print the number of ways to seat them: P(n, r) = n! / (n - r)!.", "5 3", "60", "6 2", "30");
        add(list, "Binary to Decimal", "Read a binary string. Print its decimal equivalent.", "1010", "10", "1111", "15");
        add(list, "Decimal to Binary", "Read a decimal integer. Print its binary equivalent string.", "10", "1010", "15", "1111");
        add(list, "Binary to Octal", "Read a binary string. Print its octal equivalent string.", "1010", "12", "1111", "17");
        add(list, "Octal to Binary", "Read an octal string. Print its binary equivalent string.", "12", "1010", "17", "1111");
        add(list, "Decimal to Octal", "Read a decimal integer. Print its octal equivalent string.", "10", "12", "100", "144");
        add(list, "Octal to Decimal", "Read an octal string. Print its decimal equivalent integer.", "12", "10", "144", "100");
        add(list, "Occurrences of Digit 3", "Read an integer N. Print the count of the digit '3' appearing in all integers from 0 to N.", "13", "2", "35", "7");
        add(list, "Numbers with Exactly 9 Divisors", "Read an integer N. Print the count of integers up to N that have exactly 9 positive divisors.", "100", "2", "50", "1");
        add(list, "Roots of Quadratic Equation", "Read three space-separated integers a, b, and c representing a*x^2 + b*x + c = 0. Print the roots rounded to integers in ascending order space-separated.", "1 -5 6", "2 3", "1 -2 1", "1 1");
        add(list, "Solid and Hollow Rectangle Star Pattern", "Read three space-separated integers: width, height, and solid (1 for solid, 0 for hollow). Print the pattern using '*'.", "3 3 1", "***\n***\n***", "3 3 0", "***\n* *\n***");
        add(list, "Diamond Pattern of Stars", "Read an integer N. Print a diamond pattern of stars with height 2N-1.", "2", " *\n***\n *", "3", "  *\n ***\n*****\n ***\n  *");
        add(list, "Diamond Pattern of Numbers", "Read an integer N. Print a diamond pattern of numbers with height 2N-1.", "2", " 1\n222\n 1", "3", "  1\n 222\n33333\n 222\n  1");
        add(list, "Floyd's Triangle", "Read an integer rows. Print Floyd's triangle.", "3", "1\n2 3\n4 5 6", "2", "1\n2 3");
        add(list, "Pascal's Triangle", "Read an integer rows. Print Pascal's triangle.", "3", "1\n1 1\n1 2 1", "2", "1\n1 1");

        // SET 3: String Placements (22 Questions)
        add(list, "Copy String", "Read a string and print it.", "hello", "hello", "codearena", "codearena");
        add(list, "Reverse String", "Read a string and print its reverse.", "hello", "olleh", "codearena", "anereadoc");
        add(list, "Concatenate Strings", "Read two space-separated strings and print them concatenated.", "hello world", "helloworld", "code arena", "codearena");
        add(list, "Print Length of String", "Read a string. Print its length.", "hello", "5", "competition", "11");
        add(list, "Compare Two Strings", "Read two space-separated strings. Print 'YES' if equal, else 'NO'.", "hello hello", "YES", "hello world", "NO");
        add(list, "String Length Without strlen", "Read a string. Print its length without using standard length functions (character by character count).", "hello", "5", "test", "4");
        add(list, "Toggle Case of Characters", "Read a string. Toggle the case of each character (upper to lower, lower to upper) and print it.", "Hello", "hELLO", "Spring123", "sPRING123");
        add(list, "Remove Vowels from String", "Read a string and print it with all vowels (a, e, i, o, u) removed.", "hello", "hll", "codearena", "cdrn");
        add(list, "String Palindrome Check", "Read a string. Print 'YES' if it is a palindrome, else 'NO'.", "radar", "YES", "hello", "NO");
        add(list, "Sort String Alphabetically", "Read a string and print its characters sorted alphabetically.", "cba", "abc", "code", "cdeo");
        add(list, "Remove Brackets from Expression", "Read an algebraic expression. Print it with all parenthetical brackets ('(' and ')') removed.", "(a+b)-(c)", "a+b-c", "((x))", "x");
        add(list, "Remove Non-Alphabetic Characters", "Read a string. Print the string containing only alphabetic characters.", "a1b2c!", "abc", "hello_world", "helloworld");
        add(list, "Remove Spaces from String", "Read a string. Print it with all space characters removed.", "h e l l o", "hello", "a b c", "abc");
        add(list, "Sum of Numbers in String", "Read a string. Print the sum of all digits present in the string.", "a1b2c3", "6", "hello", "0");
        add(list, "Capitalize First and Last Letter", "Read a string of space-separated words. Print it with the first and last letter of each word capitalized.", "hello world", "HellO WorlD", "java", "JavA");
        add(list, "Frequency of Characters", "Read a lowercase word. Print each character and its count in alphabetical order format (char:count) space-separated.", "apple", "a:1 e:1 l:1 p:2", "test", "e:1 s:1 t:2");
        add(list, "Non-Repeating Characters", "Read a string. Print all characters that appear exactly once, in order of appearance.", "apple", "ale", "test", "es");
        add(list, "Strings Anagram Check", "Read two space-separated words. Print 'YES' if they are anagrams, else 'NO'.", "listen silent", "YES", "apple orange", "NO");
        add(list, "Replace Substring", "Read line 1: original string. Read line 2: pattern replacement space-separated. Print modified string.", "hello world\nworld universe", "hello universe", "apple pie\npie cake", "apple cake");
        add(list, "Common Subsequences Count", "Read two space-separated strings. Print the count of their common subsequences.", "abc ab", "3", "a b", "0");
        add(list, "Wildcard Character Match", "Read line 1: original string. Read line 2: pattern (containing '*' and '?'). Print 'YES' if matched, else 'NO'.", "hello\nhe*o", "YES", "hello\nhe?o", "NO");
        add(list, "Print a String", "Read a line of text and print it back.", "Hello Competitive Programming", "Hello Competitive Programming", "CodeArena", "CodeArena");

        // SET 4: Array Placements (25 Questions)
        add(list, "Compare Two Arrays", "Read line 1: space-separated integers for Array 1. Read line 2: space-separated integers for Array 2. Print 'YES' if they are identical, else 'NO'.", "1 2 3\n1 2 3", "YES", "1 2 3\n1 3 2", "NO");
        add(list, "Find Array Type", "Read a line of space-separated integers. Print 'EVEN' if all elements are even, 'ODD' if all are odd, or 'MIXED'.", "2 4 6", "EVEN", "1 2 3", "MIXED");
        add(list, "Missing Element in Range", "Read N-1 integers in range [1, N]. Print the missing integer.", "1 2 4 5", "3", "1 2 3 5", "4");
        add(list, "Triplets with Given Sum", "Read line 1: space-separated integers. Read line 2: target sum. Print 'YES' if a triplet exists that sums to target, else 'NO'.", "12 3 4 1 6 9\n24", "YES", "1 2 3\n10", "NO");
        add(list, "Even and Odd Elements Count", "Read a line of space-separated integers. Print the count of even and odd elements space-separated.", "1 2 3 4 5", "2 3", "2 4 6", "3 0");
        add(list, "Frequency of Array Elements", "Read a line of space-separated integers. Print each element and its occurrence count in sorted format (element:count) space-separated.", "1 2 2 3", "1:1 2:2 3:1", "5 5 5", "5:3");
        add(list, "Search Element in Array", "Read line 1: space-separated integers. Read line 2: target integer. Print index (0-based) of target, or -1 if not found.", "10 20 30\n20", "1", "1 2 3\n5", "-1");
        add(list, "Smallest and Largest Element", "Read a line of space-separated integers. Print the smallest and largest element space-separated.", "5 3 9 1 7", "1 9", "-3 -1 -5", "-5 -1");
        add(list, "Sum of Elements in Array", "Read a line of space-separated integers. Print the sum of all elements.", "1 2 3 4 5", "15", "-1 -2 3", "0");
        add(list, "Longest Palindrome in Array", "Read a line of space-separated integers. Print the largest palindromic number present in the array, or -1 if none.", "121 123 343 50", "343", "12 34 56", "-1");
        add(list, "Remove Duplicates from Array", "Read a line of space-separated integers. Print the array in original order with duplicate elements removed.", "1 2 2 3 1", "1 2 3", "5 5 5", "5");
        add(list, "Minimum Scalar Product of Two Vectors", "Read line 1: space-separated integers for Vector 1. Read line 2: space-separated integers for Vector 2. Print the minimum scalar product.", "1 2 3\n4 5 6", "28", "1 3 5\n2 4 6", "38");
        add(list, "Sum of Positive Squares in Array", "Read a line of space-separated integers. Print the sum of squares of positive integers in the array.", "1 -2 3 -4", "10", "-1 -2", "0");
        add(list, "Second Smallest Element", "Read a line of space-separated integers. Print the second smallest element in the array.", "5 3 9 1 7", "3", "10 20", "20");
        add(list, "Sort Array Elements", "Read a line of space-separated integers. Print them sorted in ascending order.", "5 3 9 1", "1 3 5 9", "10 5", "5 10");
        add(list, "Reverse an Array", "Read a line of space-separated integers. Print the reversed array.", "1 2 3 4", "4 3 2 1", "10 20", "20 10");
        add(list, "Maximum Product Subarray", "Read a line of space-separated integers. Print the maximum product of a contiguous subarray.", "2 3 -2 4", "6", "-2 0 -1", "0");
        add(list, "Disjoint Arrays Check", "Read line 1: Array 1. Read line 2: Array 2. Print 'YES' if they share no common elements, else 'NO'.", "1 2 3\n4 5 6", "YES", "1 2 3\n3 4 5", "NO");
        add(list, "Array Subset Check", "Read line 1: Array 1. Read line 2: Array 2. Print 'YES' if Array 2 is a subset of Array 1, else 'NO'.", "1 2 3 4 5\n2 4", "YES", "1 2 3\n4 5", "NO");
        add(list, "Maximum Scalar Product of Vectors", "Read line 1: Vector 1. Read line 2: Vector 2. Print the maximum scalar product.", "1 2 3\n4 5 6", "32", "1 3 5\n2 4 6", "44");
        add(list, "Make Array Numbers Equal", "Read a line of space-separated integers. Print 'YES' if we can make all elements equal by multiplying elements by 2 or 3 any number of times, else 'NO'.", "50 75 100", "YES", "10 14", "NO");
        add(list, "Symmetric Pairs in Array", "Read a line of space-separated integers (flat list representing pairs, e.g. '1 2 3 4 2 1' represents pairs (1,2), (3,4), (2,1)). Print the symmetric pairs in format (x,y) space-separated.", "1 2 3 4 2 1", "(2,1)", "1 2 2 1 3 4 4 3", "(2,1) (4,3)");
        add(list, "Count Distinct Elements in Array", "Read a line of space-separated integers. Print the count of unique/distinct elements.", "1 2 2 3 1", "3", "5 5 5", "1");
        add(list, "Non-Repeating Elements in Array", "Read a line of space-separated integers. Print all elements that appear exactly once space-separated.", "1 2 2 3 1 4", "3 4", "5 5", "");
        add(list, "Repeating Elements in Array", "Read a line of space-separated integers. Print all elements that appear more than once space-separated.", "1 2 2 3 1 4", "1 2", "5 5", "5");

        // Seed 3 more math/patterns to complete exactly 100 problems
        add(list, "Spy Number Check", "Read an integer N. Print 'YES' if it is a spy number (sum of digits equals product of digits), else 'NO'.", "1124", "YES", "123", "NO");
        add(list, "Automorphic Number Check", "Read an integer N. Print 'YES' if square of N ends with N, else 'NO'.", "25", "YES", "13", "NO");
        add(list, "Harshad Number Check", "Read an integer N. Print 'YES' if N is divisible by the sum of its digits, else 'NO'.", "18", "YES", "19", "NO");

        // Write to DB
        long baseId = 1;
        for (SeededProblem sp : list) {
            Problem p = new Problem();
            p.setId(baseId);
            p.setTitle(sp.title);
            p.setDescription(sp.description);
            
            // Set 1: EASY, Sets 2 & 3: MEDIUM, Set 4 & Others (including 102-104): HARD
            Difficulty difficulty;
            if (baseId <= 28) {
                difficulty = Difficulty.EASY;
            } else if (baseId <= 76) {
                difficulty = Difficulty.MEDIUM;
            } else {
                difficulty = Difficulty.HARD;
            }
            p.setDifficulty(difficulty);
            
            p.setSampleInput(sp.sampleInput);
            p.setSampleOutput(sp.sampleOutput);
            p.setConstraints(constraintsFor(difficulty));
            p.setCreatedBy(1L);
            problemRepository.save(p);

            TestCase tcSample = new TestCase();
            tcSample.setProblemId(baseId);
            tcSample.setInput(sp.sampleInput);
            tcSample.setExpectedOutput(sp.sampleOutput);
            tcSample.setSample(true);
            testCaseRepository.save(tcSample);

            TestCase tcHidden = new TestCase();
            tcHidden.setProblemId(baseId);
            tcHidden.setInput(sp.hiddenInput);
            tcHidden.setExpectedOutput(sp.hiddenOutput);
            tcHidden.setSample(false);
            testCaseRepository.save(tcHidden);

            baseId++;
        }
    }

    private void add(List<SeededProblem> list, String title, String description,
                     String sampleInput, String sampleOutput, String hiddenInput, String hiddenOutput) {
        list.add(new SeededProblem(title, description, sampleInput, sampleOutput, hiddenInput, hiddenOutput));
    }

    private String constraintsFor(Difficulty difficulty) {
        switch (difficulty) {
            case EASY:
                return "1 <= input value <= 10^4\nTime Limit: 1 second\nMemory Limit: 256 MB\nInput values fit within a standard 32-bit signed integer.";
            case MEDIUM:
                return "1 <= input value <= 10^6\nTime Limit: 1 second\nMemory Limit: 256 MB\nSolution should avoid brute-force O(n^2) approaches where n can be large.";
            default:
                return "1 <= input value <= 10^9\nTime Limit: 2 seconds\nMemory Limit: 256 MB\nAn efficient algorithm (better than O(n^2)) is expected for full marks.";
        }
    }

    private static class SeededProblem {
        String title;
        String description;
        String sampleInput;
        String sampleOutput;
        String hiddenInput;
        String hiddenOutput;

        public SeededProblem(String title, String description, String sampleInput, String sampleOutput, String hiddenInput, String hiddenOutput) {
            this.title = title;
            this.description = description;
            this.sampleInput = sampleInput;
            this.sampleOutput = sampleOutput;
            this.hiddenInput = hiddenInput;
            this.hiddenOutput = hiddenOutput;
        }
    }
}
