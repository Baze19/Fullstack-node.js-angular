const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, searchHistory } = require('../middleware/auth');

const router = express.Router();

// Search nonprofit by EIN or organization name
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { ein, organizationName } = req.body;

    if (!ein && !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Either EIN or organization name is required'
      });
    }

    // For demo purposes, we'll use mock data since we don't have a real API key
    // In production, you would call the actual Nonprofit Check Plus API
    const mockResponse = {
      success: true,
      data: {
        organization: {
          name: organizationName || `Nonprofit Organization ${ein}`,
          ein: ein || '123456789',
          status: 'Active',
          bmfStatus: 'Active',
          pub78Status: 'Active',
          address: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA',
          phone: '(555) 123-4567',
          website: 'https://example.org',
          mission: 'To serve the community through charitable activities',
          foundedYear: '2020',
          taxExemptStatus: '501(c)(3)',
          lastUpdated: new Date().toISOString()
        },
        compliance: {
          isCompliant: true,
          bmfCompliant: true,
          pub78Compliant: true,
          lastVerified: new Date().toISOString(),
          flags: [],
          warnings: []
        },
        sourceMatches: {
          bmfMatch: true,
          pub78Match: true,
          confidence: 0.95
        }
      },
      timestamp: new Date().toISOString()
    };

    // Log search to history
    const searchEntry = {
      id: uuidv4(),
      userId: req.user.id,
      username: req.user.username,
      searchType: ein ? 'EIN' : 'Organization Name',
      searchValue: ein || organizationName,
      timestamp: new Date().toISOString(),
      result: mockResponse.data
    };

    searchHistory.unshift(searchEntry); // Add to beginning of array
    if (searchHistory.length > 1000) { // Keep only last 1000 searches
      searchHistory.splice(1000);
    }

    res.json(mockResponse);

  } catch (error) {
    console.error('Nonprofit search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search nonprofit information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get nonprofit by EIN
router.get('/:ein', authenticateToken, async (req, res) => {
  try {
    const { ein } = req.params;

    if (!ein) {
      return res.status(400).json({
        success: false,
        message: 'EIN is required'
      });
    }

    // Validate EIN format (basic validation)
    const einRegex = /^\d{2}-?\d{7}$/;
    if (!einRegex.test(ein.replace(/-/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid EIN format'
      });
    }

    // For demo purposes, return mock data
    const mockResponse = {
      success: true,
      data: {
        organization: {
          name: `Nonprofit Organization ${ein}`,
          ein: ein,
          status: 'Active',
          bmfStatus: 'Active',
          pub78Status: 'Active',
          address: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA',
          phone: '(555) 123-4567',
          website: 'https://example.org',
          mission: 'To serve the community through charitable activities',
          foundedYear: '2020',
          taxExemptStatus: '501(c)(3)',
          lastUpdated: new Date().toISOString()
        },
        compliance: {
          isCompliant: true,
          bmfCompliant: true,
          pub78Compliant: true,
          lastVerified: new Date().toISOString(),
          flags: [],
          warnings: []
        },
        sourceMatches: {
          bmfMatch: true,
          pub78Match: true,
          confidence: 0.95
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json(mockResponse);

  } catch (error) {
    console.error('Get nonprofit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve nonprofit information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;


