const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// ======================================================
// POST - Save analysis result
// ======================================================
router.post("/results", async (req, res) => {
    try {
        const {
            video_name,
            location,
            vehicle_count,
            pedestrian_count,
            near_miss_count,
            risk_score,
            risk_level,
            recommendations
        } = req.body;

        // Basic validation
        if (!video_name) {
            return res.status(400).json({
                message: "video_name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO analyses
            (
                video_name,
                location,
                vehicle_count,
                pedestrian_count,
                near_miss_count,
                risk_score,
                risk_level,
                recommendations
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                video_name,
                location || null,
                vehicle_count || 0,
                pedestrian_count || 0,
                near_miss_count || 0,
                risk_score || 0,
                risk_level || null,
                recommendations || []
            ]
        );

        res.status(201).json({
            message: "Analysis result saved successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error saving analysis result:",
            error.message
        );

        res.status(500).json({
            message: "Failed to save analysis result",
            error: error.message
        });
    }
});


// ======================================================
// GET - Fetch all analysis results
// ======================================================
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM analyses
             ORDER BY created_at DESC`
        );

        res.status(200).json({
            message: "Analysis results fetched successfully!",
            data: result.rows
        });

    } catch (error) {
        console.error(
            "Error fetching analysis results:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch analysis results",
            error: error.message
        });
    }
});


// ======================================================
// GET - Fetch one analysis by ID
// Example: /api/analysis/1
// ======================================================
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Check ID
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                message: "Invalid analysis ID"
            });
        }

        const result = await pool.query(
            `SELECT *
             FROM analyses
             WHERE id = $1`,
            [id]
        );

        // No analysis found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Analysis not found"
            });
        }

        res.status(200).json({
            message: "Analysis fetched successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error fetching analysis:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch analysis",
            error: error.message
        });
    }
});


// ======================================================
// DELETE - Delete analysis by ID
// Example: DELETE /api/analysis/1
// ======================================================
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Check ID
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                message: "Invalid analysis ID"
            });
        }

        const result = await pool.query(
            `DELETE FROM analyses
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        // No analysis found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Analysis not found"
            });
        }

        res.status(200).json({
            message: "Analysis deleted successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Error deleting analysis:",
            error.message
        );

        res.status(500).json({
            message: "Failed to delete analysis",
            error: error.message
        });
    }
});


module.exports = router;