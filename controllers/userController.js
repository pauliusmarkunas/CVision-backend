import pool from "../utils/pgConnection.js";
import path from "path";
import fs from "fs/promises";

// Get complete user profile with all related data --------------------------------------------------------------

export const getFullUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profileResult = await pool.query(
      `
      SELECT * FROM user_profiles 
      WHERE user_id = $1
    `,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userProfile = profileResult.rows[0];

    // Get all related data in parallel
    const [
      educationResult,
      experienceResult,
      skillsResult,
      certificatesResult,
    ] = await Promise.all([
      pool.query("SELECT * FROM education WHERE user_profile_id = $1", [
        userProfile.id,
      ]),
      pool.query("SELECT * FROM experience WHERE user_profile_id = $1", [
        userProfile.id,
      ]),
      pool.query("SELECT * FROM skills WHERE user_profile_id = $1", [
        userProfile.id,
      ]),
      pool.query("SELECT * FROM certifications WHERE user_profile_id = $1", [
        userProfile.id,
      ]),
    ]);

    const response = {
      profile: userProfile,
      education: educationResult.rows,
      experience: experienceResult.rows,
      skills: skillsResult.rows,
      certificates: certificatesResult.rows,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting full profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Create user profile -----------------------------------------------------------

export const createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile already exists
    const checkQuery = "SELECT id FROM user_profiles WHERE user_id = $1";
    const checkResult = await pool.query(checkQuery, [userId]);

    if (checkResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Profile already exists. Use update instead." });
    }

    // Insert new profile
    const insertQuery = `
      INSERT INTO user_profiles (
        user_id, first_name, last_name, birth_year, email_for_application,
        phone, country, city, profile_picture_url, summary, linkedin_url,
        personal_website_url, job_category, job_subcategory, seniority_level,
        expected_salary, cv_completion_percentage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const insertValues = [
      userId,
      profileData.first_name,
      profileData.last_name,
      profileData.birth_year,
      profileData.email_for_application,
      profileData.phone,
      profileData.country,
      profileData.city,
      profileData.profile_picture_url,
      profileData.summary,
      profileData.linkedin_url,
      profileData.personal_website_url,
      profileData.job_category,
      profileData.job_subcategory,
      profileData.seniority_level,
      profileData.expected_salary,
      profileData.cv_completion_percentage || 0,
    ];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile --------------------------------------------------------------

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const updateQuery = `
      UPDATE user_profiles SET
        first_name = $1,
        last_name = $2,
        birth_year = $3,
        email_for_application = $4,
        phone = $5,
        country = $6,
        city = $7,
        profile_picture_url = $8,
        summary = $9,
        linkedin_url = $10,
        personal_website_url = $11,
        job_category = $12,
        job_subcategory = $13,
        seniority_level = $14,
        expected_salary = $15,
        cv_completion_percentage = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $17
      RETURNING *
    `;
    const updateValues = [
      profileData.first_name,
      profileData.last_name,
      profileData.birth_year,
      profileData.email_for_application,
      profileData.phone,
      profileData.country,
      profileData.city,
      profileData.profile_picture_url,
      profileData.summary,
      profileData.linkedin_url,
      profileData.personal_website_url,
      profileData.job_category,
      profileData.job_subcategory,
      profileData.seniority_level,
      profileData.expected_salary,
      profileData.cv_completion_percentage,
      userId,
    ];

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Certificate add new -------------------------------------------------------------------------

export const addCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificateData = req.body;

    // First get user profile ID
    const profileQuery = "SELECT id FROM user_profiles WHERE user_id = $1";
    const profileResult = await pool.query(profileQuery, [userId]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userProfileId = profileResult.rows[0].id;

    const insertQuery = `
      INSERT INTO certifications (
        user_profile_id, title, issuing_organization, issue_date,
        expiration_date, certificate_url, certificate_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const insertValues = [
      userProfileId,
      certificateData.title,
      certificateData.issuing_organization,
      certificateData.issue_date,
      certificateData.expiration_date,
      certificateData.certificate_url,
      certificateData.certificate_id,
    ];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding certificate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update certificate -----------------------------------------------------------------

export const updateCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificateId = req.params.id;
    const certificateData = req.body;

    // Verify the certificate belongs to the user
    const verifyQuery = `
      SELECT c.id FROM certifications c
      JOIN user_profiles up ON c.user_profile_id = up.id
      WHERE up.user_id = $1 AND c.id = $2
    `;

    const verifyResult = await pool.query(verifyQuery, [userId, certificateId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Certificate not found or not owned by user" });
    }

    const updateQuery = `
      UPDATE certifications SET
        title = $1,
        issuing_organization = $2,
        issue_date = $3,
        expiration_date = $4,
        certificate_url = $5,
        certificate_id = $6
      WHERE id = $7
      RETURNING *
    `;
    const updateValues = [
      certificateData.title,
      certificateData.issuing_organization,
      certificateData.issue_date,
      certificateData.expiration_date,
      certificateData.certificate_url,
      certificateData.certificate_id,
      certificateId,
    ];

    const result = await pool.query(updateQuery, updateValues);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating certificate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete certificate -----------------------------------------------------------------

export const deleteCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificateId = req.params.id;

    // Verify the certificate belongs to the user
    const verifyQuery = `
      SELECT c.id FROM certifications c
      JOIN user_profiles up ON c.user_profile_id = up.id
      WHERE up.user_id = $1 AND c.id = $2
    `;
    const verifyResult = await pool.query(verifyQuery, [userId, certificateId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Certificate not found or not owned by user" });
    }

    const deleteQuery = "DELETE FROM certifications WHERE id = $1 RETURNING id";
    const result = await pool.query(deleteQuery, [certificateId]);

    res.json({ message: "Certificate deleted", id: result.rows[0].id });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Education add new ------------------------------------------------------------------------------

export const addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationData = req.body;

    // Get user profile ID
    const profileQuery = "SELECT id FROM user_profiles WHERE user_id = $1";
    const profileResult = await pool.query(profileQuery, [userId]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userProfileId = profileResult.rows[0].id;

    const insertQuery = `
      INSERT INTO education (
        user_profile_id, degree, field_of_study, institution,
        start_date, end_date, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const insertValues = [
      userProfileId,
      educationData.degree,
      educationData.field_of_study,
      educationData.institution,
      educationData.start_date,
      educationData.end_date,
      educationData.description,
    ];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update education -----------------------------------------------------------------

export const updateEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;
    const educationData = req.body;

    // Verify the education record belongs to the user
    const verifyQuery = `
      SELECT e.id FROM education e
      JOIN user_profiles up ON e.user_profile_id = up.id
      WHERE up.user_id = $1 AND e.id = $2
    `;
    const verifyResult = await pool.query(verifyQuery, [userId, educationId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Education record not found or not owned by user" });
    }

    const updateQuery = `
      UPDATE education SET
        degree = $1,
        field_of_study = $2,
        institution = $3,
        start_date = $4,
        end_date = $5,
        description = $6
      WHERE id = $7
      RETURNING *
    `;
    const updateValues = [
      educationData.degree,
      educationData.field_of_study,
      educationData.institution,
      educationData.start_date,
      educationData.end_date,
      educationData.description,
      educationId,
    ];

    const result = await pool.query(updateQuery, updateValues);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete education -----------------------------------------------------------------

export const deleteEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;

    // Verify the education record belongs to the user
    const verifyQuery = `
      SELECT e.id FROM education e
      JOIN user_profiles up ON e.user_profile_id = up.id
      WHERE up.user_id = $1 AND e.id = $2
    `;
    const verifyResult = await pool.query(verifyQuery, [userId, educationId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Education record not found or not owned by user" });
    }

    const deleteQuery = "DELETE FROM education WHERE id = $1 RETURNING id";
    const result = await pool.query(deleteQuery, [educationId]);

    res.json({ message: "Education record deleted", id: result.rows[0].id });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Experience create new -----------------------------------------------------------------

export const addExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceData = req.body;

    // Get user profile ID
    const profileQuery = "SELECT id FROM user_profiles WHERE user_id = $1";
    const profileResult = await pool.query(profileQuery, [userId]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userProfileId = profileResult.rows[0].id;

    const insertQuery = `
      INSERT INTO experience (
        user_profile_id, position, company_name, start_date,
        end_date, city, country, responsibilities
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const insertValues = [
      userProfileId,
      experienceData.position,
      experienceData.company_name,
      experienceData.start_date,
      experienceData.end_date,
      experienceData.city,
      experienceData.country,
      experienceData.responsibilities,
    ];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update experience -----------------------------------------------------------------

export const updateExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceId = req.params.id;
    const experienceData = req.body;

    // Verify the experience record belongs to the user
    const verifyQuery = `
      SELECT e.id FROM experience e
      JOIN user_profiles up ON e.user_profile_id = up.id
      WHERE up.user_id = $1 AND e.id = $2
    `;
    const verifyResult = await pool.query(verifyQuery, [userId, experienceId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Experience record not found or not owned by user" });
    }

    const updateQuery = `
      UPDATE experience SET
        position = $1,
        company_name = $2,
        start_date = $3,
        end_date = $4,
        city = $5,
        country = $6,
        responsibilities = $7
      WHERE id = $8
      RETURNING *
    `;
    const updateValues = [
      experienceData.position,
      experienceData.company_name,
      experienceData.start_date,
      experienceData.end_date,
      experienceData.city,
      experienceData.country,
      experienceData.responsibilities,
      experienceId,
    ];

    const result = await pool.query(updateQuery, updateValues);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceId = req.params.id;

    // Verify the experience record belongs to the user
    const verifyQuery = `
      SELECT e.id FROM experience e
      JOIN user_profiles up ON e.user_profile_id = up.id
      WHERE up.user_id = $1 AND e.id = $2
    `;
    const verifyResult = await pool.query(verifyQuery, [userId, experienceId]);

    if (verifyResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Experience record not found or not owned by user" });
    }

    const deleteQuery = "DELETE FROM experience WHERE id = $1 RETURNING id";
    const result = await pool.query(deleteQuery, [experienceId]);

    res.json({ message: "Experience record deleted", id: result.rows[0].id });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CV file operations

export const getUserCV = async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real implementation, this would return the CV file
    // For now, we'll just return the CV URL if it exists in the profile
    const query = `
      SELECT cv_url FROM user_profiles
      WHERE user_id = $1 AND cv_url IS NOT NULL
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json({ cvUrl: result.rows[0].cv_url });
  } catch (error) {
    console.error("Error getting CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadUserCV = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `cv_${userId}_CV_${fileExtension}`;
    const filePath = path.join("uploads/cv", fileName);

    // Move file to permanent location
    await fs.rename(req.file.path, filePath);

    // Update user profile with CV URL
    const cvUrl = `/cv/${fileName}`;
    const updateQuery = `
      UPDATE user_profiles SET
        cv_url = $1
      WHERE user_id = $2
      RETURNING cv_url
    `;
    const result = await pool.query(updateQuery, [cvUrl, userId]);

    res.status(201).json({ cvUrl: result.rows[0].cv_url });
  } catch (error) {
    console.error("Error uploading CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserCV = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // First get the old CV URL to delete the file
    const getQuery = "SELECT cv_url FROM user_profiles WHERE user_id = $1";
    const getResult = await pool.query(getQuery, [userId]);

    if (getResult.rows.length === 0 || !getResult.rows[0].cv_url) {
      return res.status(404).json({ message: "CV not found to update" });
    }

    // Delete old file
    const oldFilePath = path.join("uploads", getResult.rows[0].cv_url);
    try {
      await fs.unlink(oldFilePath);
    } catch (err) {
      console.warn("Could not delete old CV file:", err);
    }

    // Generate unique filename for new CV
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `cv_${userId}_CV${fileExtension}`;
    const filePath = path.join("uploads/cv", fileName);

    // Move new file to permanent location
    await fs.rename(req.file.path, filePath);

    // Update user profile with new CV URL
    const cvUrl = `/cv/${fileName}`;
    const updateQuery = `
      UPDATE user_profiles SET
        cv_url = $1
      WHERE user_id = $2
      RETURNING cv_url
    `;
    const result = await pool.query(updateQuery, [cvUrl, userId]);

    res.json({ cvUrl: result.rows[0].cv_url });
  } catch (error) {
    console.error("Error updating CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserCV = async (req, res) => {
  try {
    const userId = req.user.id;
    const cvId = req.params.id; // In this case, we might not need the ID since it's 1:1 with user

    // Get the CV URL to delete the file
    const getQuery =
      "SELECT cv_url FROM user_profiles WHERE user_id = $1 AND cv_url IS NOT NULL";
    const getResult = await pool.query(getQuery, [userId]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ message: "CV not found" });
    }

    // Delete the file
    const filePath = path.join("uploads", getResult.rows[0].cv_url);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Could not delete CV file:", err);
    }

    // Update user profile to remove CV URL
    const updateQuery = `
      UPDATE user_profiles SET
        cv_url = NULL
      WHERE user_id = $1
      RETURNING id
    `;
    const result = await pool.query(updateQuery, [userId]);

    res.json({ message: "CV deleted", userId: result.rows[0].id });
  } catch (error) {
    console.error("Error deleting CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
