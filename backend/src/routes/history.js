const express = require('express');
const { authenticateToken, requireRole, searchHistory } = require('../middleware/auth');

const router = express.Router();

// Get search history
router.get('/', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 20, userId } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Filter by user if not admin
    let filteredHistory = searchHistory;
    if (req.user.role !== 'admin' || !userId) {
      filteredHistory = searchHistory.filter(entry => entry.userId === req.user.id);
    } else if (userId && req.user.role === 'admin') {
      filteredHistory = searchHistory.filter(entry => entry.userId === parseInt(userId));
    }

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        history: paginatedHistory,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredHistory.length / limitNum),
          totalItems: filteredHistory.length,
          itemsPerPage: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve search history'
    });
  }
});

// Get search statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    
    // Filter by user if not admin
    let filteredHistory = searchHistory;
    if (req.user.role !== 'admin' || !userId) {
      filteredHistory = searchHistory.filter(entry => entry.userId === req.user.id);
    } else if (userId && req.user.role === 'admin') {
      filteredHistory = searchHistory.filter(entry => entry.userId === parseInt(userId));
    }

    const stats = {
      totalSearches: filteredHistory.length,
      searchesByType: {
        EIN: filteredHistory.filter(entry => entry.searchType === 'EIN').length,
        'Organization Name': filteredHistory.filter(entry => entry.searchType === 'Organization Name').length
      },
      searchesByResult: {
        compliant: filteredHistory.filter(entry => entry.result.compliance.isCompliant).length,
        nonCompliant: filteredHistory.filter(entry => !entry.result.compliance.isCompliant).length
      },
      recentSearches: filteredHistory.slice(0, 5).map(entry => ({
        id: entry.id,
        searchType: entry.searchType,
        searchValue: entry.searchValue,
        timestamp: entry.timestamp,
        isCompliant: entry.result.compliance.isCompliant
      }))
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve search statistics'
    });
  }
});

// Clear search history
router.delete('/', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const { userId } = req.body;

    if (userId) {
      // Clear history for specific user
      const initialLength = searchHistory.length;
      for (let i = searchHistory.length - 1; i >= 0; i--) {
        if (searchHistory[i].userId === userId) {
          searchHistory.splice(i, 1);
        }
      }
      
      res.json({
        success: true,
        message: `Cleared ${initialLength - searchHistory.length} search entries for user ${userId}`
      });
    } else {
      // Clear all history
      const clearedCount = searchHistory.length;
      searchHistory.length = 0;
      
      res.json({
        success: true,
        message: `Cleared ${clearedCount} search entries`
      });
    }

  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear search history'
    });
  }
});

// Export search history as CSV
router.get('/export', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    
    // Filter by user if not admin
    let filteredHistory = searchHistory;
    if (req.user.role !== 'admin' || !userId) {
      filteredHistory = searchHistory.filter(entry => entry.userId === req.user.id);
    } else if (userId && req.user.role === 'admin') {
      filteredHistory = searchHistory.filter(entry => entry.userId === parseInt(userId));
    }

    // Generate CSV content
    const csvHeader = 'ID,Username,Search Type,Search Value,Organization Name,EIN,Compliance Status,BMF Status,PUB78 Status,Timestamp\n';
    const csvRows = filteredHistory.map(entry => {
      const org = entry.result.organization;
      const compliance = entry.result.compliance;
      return [
        entry.id,
        entry.username,
        entry.searchType,
        entry.searchValue,
        `"${org.name}"`,
        org.ein,
        compliance.isCompliant ? 'Compliant' : 'Non-Compliant',
        compliance.bmfCompliant ? 'Active' : 'Inactive',
        compliance.pub78Compliant ? 'Active' : 'Inactive',
        entry.timestamp
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="search-history.csv"');
    res.send(csvContent);

  } catch (error) {
    console.error('Export history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export search history'
    });
  }
});

module.exports = router;
