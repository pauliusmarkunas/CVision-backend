import Joi from "joi";

// phone numbers that optionally start with a + followed by at least 7 digits, spaces, hyphens, or parentheses
const phoneRegex = /^\+?[0-9\s\-\(\)]{7,}$/;

export const profileSchema = Joi.object({
  first_name: Joi.string().max(100).optional().messages({
    "string.max": "First name cannot exceed 100 characters",
    "string.empty": "Please enter your first name",
  }),
  last_name: Joi.string().max(100).optional().messages({
    "string.max": "Last name cannot exceed 100 characters",
    "string.empty": "Please enter your last name",
  }),
  birth_year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.min": "Birth year must be after 1900",
      "number.max": `Birth year cannot be in the future`,
      "number.base": "Please enter a valid birth year",
    }),
  email_for_application: Joi.string().email().max(100).optional().messages({
    "string.email": "Please enter a valid email address",
    "string.max": "Email cannot exceed 100 characters",
    "string.empty": "Please enter your application email",
  }),
  phone: Joi.string().pattern(phoneRegex).max(50).optional().messages({
    "string.pattern.base": "Please enter a valid phone number",
    "string.max": "Phone number cannot exceed 50 characters",
  }),
  country: Joi.string().max(50).optional().messages({
    "string.max": "Country name cannot exceed 50 characters",
  }),
  city: Joi.string().max(50).optional().messages({
    "string.max": "City name cannot exceed 50 characters",
  }),
  profile_picture_url: Joi.string().uri().max(255).optional().messages({
    "string.uri": "Please enter a valid URL for your profile picture",
    "string.max": "Profile picture URL cannot exceed 255 characters",
  }),
  summary: Joi.string().max(500).optional().messages({
    "string.max": "Summary cannot exceed 500 characters",
  }),
  linkedin_url: Joi.string().uri().max(255).optional().messages({
    "string.uri": "Please enter a valid LinkedIn URL",
    "string.max": "LinkedIn URL cannot exceed 255 characters",
  }),
  personal_website_url: Joi.string().uri().max(255).optional().messages({
    "string.uri": "Please enter a valid website URL",
    "string.max": "Website URL cannot exceed 255 characters",
  }),
  job_category_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Please select a valid job category",
    "number.positive": "Job category ID must be positive",
  }),
  job_subcategory_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Please select a valid job subcategory",
    "number.positive": "Job subcategory ID must be positive",
  }),
  seniority_level: Joi.string()
    .valid("Junior", "Mid", "Senior")
    .optional()
    .messages({
      "any.only": "Please select either Junior, Mid or Senior level",
    }),
  expected_salary: Joi.number()
    .precision(2)
    .positive()
    .max(999999.99)
    .optional()
    .messages({
      "number.base": "Please enter a valid salary amount",
      "number.positive": "Salary must be a positive number",
      "number.precision": "Salary can have maximum 2 decimal places",
      "number.max": "Salary cannot exceed €999,999.99",
    }),
  cv_completion_percentage: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .default(0)
    .optional()
    .messages({
      "number.min": "Completion percentage cannot be negative",
      "number.max": "Completion percentage cannot exceed 100%",
    }),
}).options({ abortEarly: false });

export const certificateSchema = Joi.object({
  title: Joi.string().max(150).optional().messages({
    "string.max": "Certificate title cannot exceed 150 characters",
    "string.empty": "Please enter certificate title",
  }),
  issuing_organization: Joi.string().max(150).optional().messages({
    "string.max": "Organization name cannot exceed 150 characters",
    "string.empty": "Please enter issuing organization",
  }),
  issue_date: Joi.date().iso().optional().messages({
    "date.base": "Please enter a valid issue date",
    "date.format": "Issue date must be in YYYY-MM-DD format",
  }),
  expiration_date: Joi.date()
    .iso()
    .greater(Joi.ref("issue_date"))
    .optional()
    .allow(null)
    .messages({
      "date.base": "Please enter a valid expiration date",
      "date.format": "Expiration date must be in YYYY-MM-DD format",
      "date.greater": "Expiration date must be after issue date",
    }),
  certificate_url: Joi.string()
    .uri()
    .max(255)
    .optional()
    .allow("", null)
    .messages({
      "string.uri": "Please enter a valid certificate URL",
      "string.max": "Certificate URL cannot exceed 255 characters",
    }),
  certificate_id: Joi.string().max(100).optional().allow("", null).messages({
    "string.max": "Certificate ID cannot exceed 100 characters",
  }),
}).options({ abortEarly: false });

export const educationSchema = Joi.object({
  degree: Joi.string().max(100).optional().messages({
    "string.max": "Degree name cannot exceed 100 characters",
    "string.empty": "Please enter your degree",
  }),
  field_of_study: Joi.string().max(100).optional().messages({
    "string.max": "Field of study cannot exceed 100 characters",
    "string.empty": "Please enter your field of study",
  }),
  institution: Joi.string().max(100).optional().messages({
    "string.max": "Institution name cannot exceed 100 characters",
    "string.empty": "Please enter your institution",
  }),
  start_date: Joi.date().iso().optional().messages({
    "date.base": "Please enter a valid start date",
    "date.format": "Start date must be in YYYY-MM-DD format",
  }),
  end_date: Joi.date()
    .iso()
    .greater(Joi.ref("start_date"))
    .optional()
    .allow(null)
    .messages({
      "date.base": "Please enter a valid end date",
      "date.format": "End date must be in YYYY-MM-DD format",
      "date.greater": "End date must be after start date",
    }),
  description: Joi.string().max(500).optional().allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
}).options({ abortEarly: false });

export const experienceSchema = Joi.object({
  position: Joi.string().max(100).optional().messages({
    "string.max": "Position title cannot exceed 100 characters",
    "string.empty": "Please enter your position",
  }),
  company_name: Joi.string().max(100).optional().messages({
    "string.max": "Company name cannot exceed 100 characters",
    "string.empty": "Please enter company name",
  }),
  start_date: Joi.date().iso().optional().messages({
    "date.base": "Please enter a valid start date",
    "date.format": "Start date must be in YYYY-MM-DD format",
  }),
  end_date: Joi.date()
    .iso()
    .greater(Joi.ref("start_date"))
    .optional()
    .allow(null)
    .messages({
      "date.base": "Please enter a valid end date",
      "date.format": "End date must be in YYYY-MM-DD format",
      "date.greater": "End date must be after start date",
    }),
  city: Joi.string().max(100).optional().messages({
    "string.max": "City name cannot exceed 100 characters",
    "string.empty": "Please enter city",
  }),
  country: Joi.string().max(100).optional().messages({
    "string.max": "Country name cannot exceed 100 characters",
    "string.empty": "Please enter country",
  }),
  responsibilities: Joi.string().max(500).optional().allow("", null).messages({
    "string.max": "Responsibilities cannot exceed 500 characters",
  }),
}).options({ abortEarly: false });
