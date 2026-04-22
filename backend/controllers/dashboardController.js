const Complaint = require('../models/Complaint');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const escalated = await Complaint.countDocuments({ status: 'escalated' });
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const submitted = await Complaint.countDocuments({ status: 'submitted' });

    const resolutionRate = totalComplaints > 0
      ? ((resolved / totalComplaints) * 100).toFixed(1)
      : '0.0';

    // Complaints by category
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryData = byCategory.map(c => ({
      category: c._id,
      count: c.count,
      pct: totalComplaints > 0 ? Math.round((c.count / totalComplaints) * 100) : 0,
    }));

    // Complaints by status
    const byStatus = { submitted, pending, escalated, resolved };

    // Complaints by severity
    const bySeverity = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Recent complaints (last 10)
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('trackingId category status severity authority createdAt');

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          filed: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = monthlyTrend.map(m => ({
      month: monthNames[m._id.month],
      filed: m.filed,
      resolved: m.resolved,
    }));

    // Top authorities
    const topAuthorities = await Complaint.aggregate([
      { $group: {
        _id: '$authority',
        total: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $ne: ['$status', 'resolved'] }, 1, 0] } },
      }},
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    const authorityData = topAuthorities.map(a => ({
      name: a._id,
      resolved: a.resolved,
      pending: a.pending,
      rate: a.total > 0 ? ((a.resolved / a.total) * 100).toFixed(1) + '%' : '0%',
    }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          resolutionRate: resolutionRate + '%',
          avgResponseTime: '48 hrs',
          activeEscalations: escalated,
        },
        byStatus,
        byCategory: categoryData,
        bySeverity: bySeverity.map(s => ({ severity: s._id, count: s.count })),
        monthlyTrend: trendData,
        topAuthorities: authorityData,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { getDashboardStats };
