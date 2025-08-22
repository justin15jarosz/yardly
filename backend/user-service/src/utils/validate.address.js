export const validateAddress = (req, res, next) => {
    const { email,
        address_line1,
        address_line2,
        city,
        state,
        zip,
        country } = req.body;

    const errors = [];

    // Email validation
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.push('Email must be a valid email address');
        }
    }

    // Address Line 1 validation (required)
    if (!address_line1 || address_line1.trim() === '') {
        errors.push('Address line 1 is required');
    } else if (address_line1.trim().length > 100) {
        errors.push('Address line 1 must be 100 characters or less');
    }

    // Address Line 2 validation (optional)
    if (address_line2 && address_line2.trim().length > 100) {
        errors.push('Address line 2 must be 100 characters or less');
    }

    // City validation
    if (!city || city.trim() === '') {
        errors.push('City is required');
    } else if (city.trim().length > 50) {
        errors.push('City must be 50 characters or less');
    } else {
        const cityRegex = /^[a-zA-Z\s\-'\.]+$/;
        if (!cityRegex.test(city.trim())) {
            errors.push('City must contain only letters, spaces, hyphens, apostrophes, and periods');
        }
    }

    // State validation
    if (!state || state.trim() === '') {
        errors.push('State is required');
    } else if (state.trim().length > 50) {
        errors.push('State must be 50 characters or less');
    }

    // ZIP code validation
    if (!zip || zip.trim() === '') {
        errors.push('ZIP code is required');
    } else {
        const zipRegex = /^[\d\s\-A-Za-z]+$/;
        if (!zipRegex.test(zip.trim()) || zip.trim().length > 20) {
            errors.push('ZIP code must be valid and 20 characters or less');
        }
    }

    // Country validation
    if (!country || country.trim() === '') {
        errors.push('Country is required');
    } else if (country.trim().length > 50) {
        errors.push('Country must be 50 characters or less');
    }

    // Additional security validations
    const dangerousCharsRegex = /<script|javascript:|data:|vbscript:|on\w+\s*=/i;
    const fields = { email, address_line1, address_line2, city, state, zip, country };
    
    for (const [fieldName, fieldValue] of Object.entries(fields)) {
        if (fieldValue && dangerousCharsRegex.test(fieldValue)) {
            errors.push(`${fieldName} contains potentially dangerous content`);
        }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize and normalize the data
    req.body.email = email.trim().toLowerCase();
    req.body.address_line1 = address_line1.trim();
    req.body.address_line2 = address_line2 ? address_line2.trim() : null;
    req.body.city = city.trim();
    req.body.state = state.trim();
    req.body.zip = zip.trim();
    req.body.country = country.trim();

    // If validation passes, continue to next middleware
    next();
};