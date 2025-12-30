package com.advo.desk.validator;

import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Validator for Indian advocate enrollment numbers
 * Format: STATE_CODE/SERIAL_NUMBER/YEAR
 * Example: MAH/5678/2021, UP/1102/2022, D/2345/2023
 */
@Component
public class EnrollmentValidator {

    // Valid Indian state codes for Bar Councils
    private static final Set<String> VALID_STATE_CODES = new HashSet<>(Arrays.asList(
            "MAH", "UP", "D", "KA", "TN", "WB", "GJ", "RJ", "MP", "HR", "PB",
            "AP", "TS", "KL", "OR", "JH", "CT", "UK", "HP", "AS", "BR", "MH",
            "GA", "MN", "ML", "NL", "SK", "TR", "AR", "MZ", "DL", "PY", "CH",
            "AN", "LD", "DN", "DD"));

    // Pattern: STATE_CODE/SERIAL_NUMBER/YEAR
    private static final Pattern ENROLLMENT_PATTERN = Pattern.compile("^[A-Z]{1,3}/\\d{1,6}/\\d{4}$");

    /**
     * Validates enrollment number format and content
     * 
     * @param enrollmentNumber The enrollment number to validate
     * @return true if valid, false otherwise
     */
    public boolean isValid(String enrollmentNumber) {
        if (enrollmentNumber == null || enrollmentNumber.trim().isEmpty()) {
            return false;
        }

        // Check pattern match
        if (!ENROLLMENT_PATTERN.matcher(enrollmentNumber).matches()) {
            return false;
        }

        // Split and validate parts
        String[] parts = enrollmentNumber.split("/");
        if (parts.length != 3) {
            return false;
        }

        String stateCode = parts[0];
        String serialNumber = parts[1];
        String yearStr = parts[2];

        // Validate state code
        if (!VALID_STATE_CODES.contains(stateCode)) {
            return false;
        }

        // Validate year (between 1950 and current year)
        try {
            int year = Integer.parseInt(yearStr);
            int currentYear = Year.now().getValue();
            if (year < 1950 || year > currentYear) {
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }

        // Validate serial number (1-6 digits)
        try {
            int serial = Integer.parseInt(serialNumber);
            if (serial < 1 || serial > 999999) {
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }

        return true;
    }

    /**
     * Get validation error message
     * 
     * @param enrollmentNumber The enrollment number to validate
     * @return Error message or null if valid
     */
    public String getValidationMessage(String enrollmentNumber) {
        if (enrollmentNumber == null || enrollmentNumber.trim().isEmpty()) {
            return "Enrollment number is required";
        }

        if (!ENROLLMENT_PATTERN.matcher(enrollmentNumber).matches()) {
            return "Invalid format. Use: STATE/NUMBER/YEAR (e.g., MAH/5678/2021)";
        }

        String[] parts = enrollmentNumber.split("/");
        if (parts.length != 3) {
            return "Invalid format. Use: STATE/NUMBER/YEAR";
        }

        String stateCode = parts[0];
        if (!VALID_STATE_CODES.contains(stateCode)) {
            return "Invalid state code: " + stateCode;
        }

        try {
            int year = Integer.parseInt(parts[2]);
            int currentYear = Year.now().getValue();
            if (year < 1950 || year > currentYear) {
                return "Year must be between 1950 and " + currentYear;
            }
        } catch (NumberFormatException e) {
            return "Invalid year format";
        }

        try {
            int serial = Integer.parseInt(parts[1]);
            if (serial < 1 || serial > 999999) {
                return "Serial number must be between 1 and 999999";
            }
        } catch (NumberFormatException e) {
            return "Invalid serial number format";
        }

        return null; // Valid
    }

    /**
     * Get list of valid state codes
     * 
     * @return Set of valid state codes
     */
    public Set<String> getValidStateCodes() {
        return new HashSet<>(VALID_STATE_CODES);
    }
}
